import { PrismaService } from '../prisma/prisma.service';
export declare class ScenarioService {
    private prisma;
    constructor(prisma: PrismaService);
    runSimulation(conversationId: string, parameters: any, userId: string): Promise<{
        result: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        createdAt: Date;
        conversationId: string;
        variables: import("@prisma/client/runtime/library").JsonValue;
        chartData: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
