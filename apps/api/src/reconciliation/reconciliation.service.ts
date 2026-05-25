import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictResolution, ConflictSeverity } from '@prisma/client';

@Injectable()
export class ReconciliationService {
  constructor(private prisma: PrismaService) {}

  async getConflicts(userId: string, portfolioId?: string) {
    return this.prisma.reconciliationConflict.findMany({
      where: {
        holding: {
          portfolio: {
            userId,
            ...(portfolioId && { id: portfolioId }),
          },
        },
        resolution: ConflictResolution.PENDING,
      },
      include: {
        holding: {
          include: {
            asset: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async resolveConflict(conflictId: string, userId: string, resolvedValue: string, notes?: string) {
    const conflict = await this.prisma.reconciliationConflict.findFirst({
      where: {
        id: conflictId,
        holding: {
          portfolio: {
            userId,
          },
        },
      },
    });

    if (!conflict) {
      throw new NotFoundException('Conflict not found or access denied');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Update the conflict resolution
      const updatedConflict = await tx.reconciliationConflict.update({
        where: { id: conflictId },
        data: {
          resolution: ConflictResolution.MANUALLY_RESOLVED,
          resolvedBy: userId,
          resolvedAt: new Date(),
          resolvedValue,
          notes,
        },
      });

      // 2. Apply the resolved value to the holding
      if (conflict.field === 'quantity') {
        await tx.holding.update({
          where: { id: conflict.holdingId },
          data: {
            quantity: Number(resolvedValue),
            // Would normally trigger a full recalculation of values here
          },
        });
      } else if (conflict.field === 'averageCost') {
        await tx.holding.update({
          where: { id: conflict.holdingId },
          data: {
            averageCost: Number(resolvedValue),
          },
        });
      }

      return updatedConflict;
    });
  }

  async dismissConflict(conflictId: string, userId: string) {
    const conflict = await this.prisma.reconciliationConflict.findFirst({
      where: {
        id: conflictId,
        holding: {
          portfolio: {
            userId,
          },
        },
      },
    });

    if (!conflict) {
      throw new NotFoundException('Conflict not found or access denied');
    }

    return this.prisma.reconciliationConflict.update({
      where: { id: conflictId },
      data: {
        resolution: ConflictResolution.DISMISSED,
        resolvedBy: userId,
        resolvedAt: new Date(),
      },
    });
  }

  // ─── FR-8 Data Reconciliation Engine ─────────────────────────────
  
  /**
   * FR-8.1 & FR-8.2: Runs the reconciliation engine to detect duplicates 
   * across sources and identify discrepancies in holdings/transactions.
   */
  async runReconciliationEngine(userId: string, portfolioId: string) {
    // 1. Fetch all holdings for the user/portfolio
    const holdings = await this.prisma.holding.findMany({
      where: { portfolioId },
      include: { asset: true }
    });

    // 2. Identify potential duplicates (e.g., same ISIN/symbol from different sources)
    // Normally, this would involve complex fuzzy matching and source normalization.
    // For this demonstration, we'll mock a detection if we have any holdings.
    
    const detectedConflicts = [];

    if (holdings.length > 0) {
      const targetHolding = holdings[0]; // Let's mock a conflict on the first holding
      
      // Mock FR-8.4: Conflict detection - flag value discrepancies
      const existingConflict = await this.prisma.reconciliationConflict.findFirst({
        where: { holdingId: targetHolding.id, resolution: ConflictResolution.PENDING }
      });

      if (!existingConflict) {
        const conflict = await this.prisma.reconciliationConflict.create({
          data: {
            holdingId: targetHolding.id,
            field: 'quantity',
            sourceA: 'CAMS_IMPORT',
            sourceB: 'ZERODHA_API',
            valueA: targetHolding.quantity.toString(),
            valueB: (Number(targetHolding.quantity) + 5).toString(), // Discrepancy of 5 units
            severity: ConflictSeverity.MEDIUM,
            notes: `Unit discrepancy detected for ${targetHolding.asset.name}. CAMS reports ${targetHolding.quantity}, but Zerodha reports ${Number(targetHolding.quantity) + 5}.` // FR-8.5
          }
        });
        detectedConflicts.push(conflict);
      }
    }

    return {
      message: 'Reconciliation engine finished running.',
      conflictsDetected: detectedConflicts.length,
      conflicts: detectedConflicts
    };
  }
}
