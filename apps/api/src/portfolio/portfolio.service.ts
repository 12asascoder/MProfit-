import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { Portfolio } from '@prisma/client';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, tenantId: string, dto: CreatePortfolioDto): Promise<Portfolio> {
    // If setting as default, unset others
    if (dto.isDefault) {
      await this.prisma.portfolio.updateMany({
        where: { userId, tenantId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.portfolio.create({
      data: {
        ...dto,
        userId,
        tenantId,
        isDefault: dto.isDefault ?? false,
      },
    });
  }

  async findAll(userId: string, tenantId: string): Promise<Portfolio[]> {
    return this.prisma.portfolio.findMany({
      where: {
        tenantId,
        isActive: true,
        OR: [
          { userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        children: true,
        members: {
          include: { user: { select: { name: true, email: true } } }
        },
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ],
    });
  }

  async findOne(id: string, userId: string, tenantId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
      include: {
        holdings: {
          include: {
            asset: true,
          }
        },
      }
    });

    if (!portfolio || !portfolio.isActive) {
      throw new NotFoundException('Portfolio not found');
    }

    if (portfolio.userId !== userId || portfolio.tenantId !== tenantId) {
      // Allow access if they are a member
      const member = await this.prisma.portfolioMember.findUnique({
        where: {
          portfolioId_userId: {
            portfolioId: id,
            userId,
          }
        }
      });
      
      if (!member) {
        throw new ForbiddenException('Access denied to this portfolio');
      }
    }

    return portfolio;
  }

  async getSummary(id: string, userId: string, tenantId: string) {
    const portfolio = await this.findOne(id, userId, tenantId);
    
    // Calculate aggregate summary metrics dynamically
    const holdings = portfolio.holdings || [];
    
    const investedAmount = holdings.reduce((sum: number, h: any) => sum + Number(h.investedValue), 0);
    const currentValue = holdings.reduce((sum: number, h: any) => sum + Number(h.currentValue), 0);
    const todaysGain = holdings.reduce((sum: number, h: any) => sum + Number(h.dayChange) * Number(h.quantity), 0);
    const unrealizedGain = currentValue - investedAmount;
    
    return {
      netWorth: currentValue,
      investedAmount,
      currentValue,
      todaysGain,
      unrealizedGain,
      absoluteReturnPercent: investedAmount > 0 ? (unrealizedGain / investedAmount) * 100 : 0,
      lastSyncAt: new Date(),
    };
  }
}
