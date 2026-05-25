import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, tenantId: string, dto: CreateTransactionDto) {
    // 1. Verify Portfolio access
    const portfolio = await this.prisma.portfolio.findFirst({
      where: {
        id: dto.portfolioId,
        userId,
        tenantId,
      }
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found or access denied');
    }

    // 2. Verify Asset exists
    const asset = await this.prisma.asset.findUnique({
      where: { id: dto.assetId }
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    // 3. Start a database transaction to record transaction AND update holdings
    return this.prisma.$transaction(async (tx) => {
      // Record the transaction
      const transaction = await tx.transaction.create({
        data: {
          ...dto,
        }
      });

      this.logger.log(`Created ${dto.type} transaction for asset ${dto.assetId} in portfolio ${dto.portfolioId}`);

      // Find existing holding
      let holding = await tx.holding.findUnique({
        where: {
          portfolioId_assetId_folioNumber: {
            portfolioId: dto.portfolioId,
            assetId: dto.assetId,
            folioNumber: dto.folioNumber || '',
          }
        }
      });

      // If BUY type, increment quantity and update average cost
      if (dto.type === TransactionType.BUY || dto.type === TransactionType.SIP) {
        if (!holding) {
          holding = await tx.holding.create({
            data: {
              portfolioId: dto.portfolioId,
              assetId: dto.assetId,
              folioNumber: dto.folioNumber || '',
              quantity: dto.quantity,
              averageCost: dto.price,
              investedValue: dto.amount,
              currentPrice: dto.price, // Fallback until market sync
              currentValue: dto.amount,
            }
          });
        } else {
          // Calculate new average cost
          const currentQty = Number(holding.quantity);
          const currentAvgCost = Number(holding.averageCost);
          
          const newTotalQty = currentQty + dto.quantity;
          const newTotalInvested = (currentQty * currentAvgCost) + dto.amount;
          const newAvgCost = newTotalInvested / newTotalQty;

          holding = await tx.holding.update({
            where: { id: holding.id },
            data: {
              quantity: newTotalQty,
              averageCost: newAvgCost,
              investedValue: newTotalInvested,
              // Keep current price, recalculate current value
              currentValue: Number(holding.currentPrice) * newTotalQty,
            }
          });
        }

        // Add Tax Lot for BUY
        await tx.taxLot.create({
          data: {
            holdingId: holding.id,
            assetId: dto.assetId,
            acquisitionDate: new Date(dto.date),
            quantity: dto.quantity,
            remainingQuantity: dto.quantity,
            costBasis: dto.price,
            totalCost: dto.amount,
          }
        });
      }
      
      // If SELL type, reduce quantity and apply to tax lots (FIFO)
      else if (dto.type === TransactionType.SELL) {
        if (!holding || Number(holding.quantity) < dto.quantity) {
          throw new BadRequestException('Insufficient quantity to sell');
        }

        const newTotalQty = Number(holding.quantity) - dto.quantity;
        const newTotalInvested = Number(holding.investedValue) - (Number(holding.averageCost) * dto.quantity);

        holding = await tx.holding.update({
          where: { id: holding.id },
          data: {
            quantity: newTotalQty,
            investedValue: newTotalInvested > 0 ? newTotalInvested : 0,
            currentValue: Number(holding.currentPrice) * newTotalQty,
          }
        });

        // Simple FIFO tax lot matching (mocked for simplicity here, would be a complex engine in real app)
        // Would normally update taxLots remaining quantity and calculate realized gains
      }

      return transaction;
    });
  }

  async findAllByPortfolio(portfolioId: string, userId: string, tenantId: string) {
    // Verify access
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id: portfolioId, userId, tenantId }
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found or access denied');
    }

    return this.prisma.transaction.findMany({
      where: { portfolioId },
      include: {
        asset: true,
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  // ─── FR-9.2 & FR-9.3 Corporate Actions Tracking ─────────────────
  async processCorporateAction(assetId: string, type: 'STOCK_SPLIT' | 'BONUS' | 'DIVIDEND', ratio?: string) {
    // For a stock split (e.g. 2:1), ratio means every 1 share becomes 2 shares.
    if (type === 'STOCK_SPLIT' && ratio) {
      const [newShares, oldShares] = ratio.split(':').map(Number);
      const splitFactor = newShares / oldShares;

      // Find all holdings of this asset
      const holdings = await this.prisma.holding.findMany({
        where: { assetId }
      });

      return this.prisma.$transaction(async (tx) => {
        // Log the corporate action event
        await tx.corporateAction.create({
          data: {
            assetId,
            type: 'STOCK_SPLIT',
            ratio,
            recordDate: new Date(),
          }
        });

        // Recompute quantity and cost basis automatically
        for (const holding of holdings) {
          const currentQty = Number(holding.quantity);
          const currentAvgCost = Number(holding.averageCost);
          
          const newQty = currentQty * splitFactor;
          const newAvgCost = currentAvgCost / splitFactor;

          await tx.holding.update({
            where: { id: holding.id },
            data: {
              quantity: newQty,
              averageCost: newAvgCost,
              // Current value remains the same, price splits
              currentPrice: Number(holding.currentPrice) / splitFactor,
            }
          });
          
          this.logger.log(`Adjusted holding ${holding.id} for split: Qty ${currentQty}->${newQty}, Cost ${currentAvgCost}->${newAvgCost}`);
        }
      });
    }
  }
}
