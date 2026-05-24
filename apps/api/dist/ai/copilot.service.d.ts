import { PrismaService } from '../prisma/prisma.service';
export declare class CopilotService {
    private prisma;
    private readonly logger;
    private openai;
    constructor(prisma: PrismaService);
    startConversation(userId: string, portfolioId: string): Promise<{
        id: string;
        title: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        portfolioId: string;
    }>;
    sendMessage(conversationId: string, content: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        role: string;
        content: string;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        tokenCount: number | null;
        conversationId: string;
    }>;
    getConversationHistory(conversationId: string, userId: string): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            role: string;
            content: string;
            metadata: import("@prisma/client/runtime/library").JsonValue;
            tokenCount: number | null;
            conversationId: string;
        }[];
    } & {
        id: string;
        title: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        portfolioId: string;
    }>;
}
