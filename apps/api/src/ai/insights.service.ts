import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIInsightType } from '@prisma/client';

@Injectable()
export class InsightsService {
  private readonly logger = new Logger(InsightsService.name);

  constructor(private prisma: PrismaService) {}

  async generateInsightsForPortfolio(portfolioId: string) {
    // In production, this would query portfolio data and send it to an LLM
    // or run deterministic algorithms to find drift, concentration, etc.
    
    // Mocking insight generation
    const insights = [
      {
        portfolioId,
        type: AIInsightType.CONCENTRATION_RISK,
        title: 'High Exposure to Financials',
        body: 'Your portfolio has a 42% exposure to the Financial sector. Consider diversifying into IT or Pharma to reduce sector-specific risk.',
        confidence: 0.92,
        whyGenerated: 'Sector allocation exceeded 40% threshold.',
        dataTrigger: '{"sector": "Financials", "allocation": 42.1}',
        disclaimer: 'This is an AI-generated insight based on your current holdings.',
        actionLabel: 'Explore Diversification',
      },
      {
        portfolioId,
        type: AIInsightType.TAX_OPTIMIZATION,
        title: 'Tax Harvesting Opportunity',
        body: 'You have unrealized short-term losses of ₹45,000 in HDFC Bank. Selling now could offset your recent STCG.',
        confidence: 0.88,
        whyGenerated: 'Identified loss-making asset with offsetting STCG in the current financial year.',
        dataTrigger: '{"asset": "HDFC Bank", "unrealizedLoss": 45000}',
        disclaimer: 'Tax laws are subject to change. Consult a tax advisor before acting.',
        actionLabel: 'View Tax Lots',
      }
    ];

    const createdInsights = await Promise.all(
      insights.map(insight => 
        this.prisma.aIInsight.create({
          data: insight
        })
      )
    );

    return createdInsights;
  }

  async getActiveInsights(portfolioId: string) {
    return this.prisma.aIInsight.findMany({
      where: {
        portfolioId,
        isDismissed: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { confidence: 'desc' },
      take: 5
    });
  }

  async dismissInsight(insightId: string) {
    return this.prisma.aIInsight.update({
      where: { id: insightId },
      data: { isDismissed: true }
    });
  }
}
