import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Groq from 'groq-sdk';

@Injectable()
export class CopilotService {
  private readonly logger = new Logger(CopilotService.name);
  private groq: Groq | null = null;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      this.groq = new Groq({ apiKey });
    } else {
      this.logger.warn('GROQ_API_KEY not found. Copilot will run in mock mode.');
    }
  }

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

    // 3. Process RAG + LLM call
    let responseContent = "I'm currently running in offline mock mode. Please configure OPENAI_API_KEY in the backend to access live intelligence.";
    
    if (this.groq) {
      try {
        // Fetch context
        const portfolio = await this.prisma.portfolio.findUnique({
          where: { id: conversation.portfolioId },
          include: { holdings: { include: { asset: true } } }
        });

        // Get past messages for chat history
        const history = await this.prisma.aIMessage.findMany({
          where: { conversationId },
          orderBy: { createdAt: 'asc' },
          take: 10
        });

        const messages: any[] = [
          { role: 'system', content: `You are MProfit AI Copilot, a professional wealth management advisor. The user has a portfolio with the following holdings: \n\n${JSON.stringify(portfolio?.holdings.map(h => ({ name: h.asset.name, quantity: h.quantity, averageCost: h.averageCost })), null, 2)}\n\nProvide concise, professional, and actionable advice. Never suggest executable actions or guarantee returns.` },
          ...history.map(m => ({ role: m.role, content: m.content }))
        ];

        const completion = await this.groq.chat.completions.create({
          model: 'llama3-70b-8192',
          messages,
        });

        responseContent = completion.choices[0]?.message?.content || responseContent;
      } catch (error: any) {
        this.logger.error(`Groq error: ${error.message}`);
        responseContent = "I'm sorry, I encountered an error connecting to the AI brain.";
      }
    } else {
      // Mock mode logic
      if (content.toLowerCase().includes('allocate') || content.toLowerCase().includes('equity')) {
        responseContent = "Based on your portfolio's current asset allocation, your equity exposure is slightly above your target of 70%. I recommend reviewing your recent SIPs or considering rebalancing your large-cap holdings.";
      } else {
        responseContent = "This is a mocked AI response. In production, this would provide deep context-aware insights regarding your MProfit portfolio.";
      }
    }

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
