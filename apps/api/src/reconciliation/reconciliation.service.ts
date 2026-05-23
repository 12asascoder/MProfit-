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
}
