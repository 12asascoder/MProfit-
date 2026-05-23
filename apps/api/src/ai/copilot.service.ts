import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CopilotService {
  private readonly logger = new Logger(CopilotService.name);

  constructor(private prisma: PrismaService) {}

  async startConversation(userId: string, portfolioId: string) {
    return this.prisma.aIConversation.create({
      data: {
        userId,
        portfolioId,
        title: 'New Chat',
      }
    });
  }

  async sendMessage(conversationId: string, content: string, userId: string) {
    // 1. Verify conversation belongs to user
    const conversation = await this.prisma.aIConversation.findFirst({
      where: { id: conversationId, userId }
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // 2. Save user message
    await this.prisma.aIMessage.create({
      data: {
        conversationId,
        role: 'user',
        content,
      }
    });

    // 3. Process RAG + LLM call (Mocked)
    // Here we would:
    // a. Embed the query
    // b. Retrieve context (Portfolio holdings, transactions, market data)
    // c. Call Gemini/OpenAI
    // d. Apply guardrails

    const responseContent = "Based on your portfolio's current asset allocation, your equity exposure is slightly above your target of 70%. I recommend reviewing your recent SIPs or considering rebalancing your large-cap holdings.";

    // 4. Save AI response
    const aiMessage = await this.prisma.aIMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        content: responseContent,
      }
    });

    // Update conversation title if this is the first exchange
    const messageCount = await this.prisma.aIMessage.count({
      where: { conversationId }
    });

    if (messageCount <= 2) {
      await this.prisma.aIConversation.update({
        where: { id: conversationId },
        data: { title: content.substring(0, 30) + '...' }
      });
    }

    return aiMessage;
  }

  async getConversationHistory(conversationId: string, userId: string) {
    const conversation = await this.prisma.aIConversation.findFirst({
      where: { id: conversationId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }
}
