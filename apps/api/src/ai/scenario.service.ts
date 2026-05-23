import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScenarioService {
  constructor(private prisma: PrismaService) {}

  async runSimulation(conversationId: string, parameters: any, userId: string) {
    // Ensure the conversation belongs to the user
    const conversation = await this.prisma.aIConversation.findFirst({
      where: { id: conversationId, userId }
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Mock Simulation Engine
    // In production, this would apply Monte Carlo simulations or stress tests
    // based on historical covariance matrix and the portfolio's beta
    
    const mockResult = {
      expectedReturn: 14.2,
      worstCaseDrawdown: -18.5,
      probabilityOfSuccess: 0.85, // e.g. for a goal
      simulatedValueIn5Years: 8500000,
    };

    const mockChartData = {
      labels: ['2025', '2026', '2027', '2028', '2029', '2030'],
      median: [5000, 5700, 6400, 7200, 8000, 8500],
      optimistic: [5000, 6200, 7500, 8900, 10500, 12000],
      pessimistic: [5000, 4800, 5100, 5500, 6000, 6300],
    };

    const scenario = await this.prisma.aIScenario.create({
      data: {
        conversationId,
        variables: parameters,
        result: mockResult,
        chartData: mockChartData,
      }
    });

    return scenario;
  }
}
