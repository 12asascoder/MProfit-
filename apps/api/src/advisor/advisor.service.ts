import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdvisorService {
  constructor(private prisma: PrismaService) {}

  async inviteClient(advisorId: string, tenantId: string, email: string, name: string) {
    // 1. Find client by email (or create placeholder logic)
    const client = await this.prisma.user.findUnique({
      where: { email }
    });
    
    // 2. Create AdvisorClient relationship
    const relationship = await this.prisma.advisorClient.create({
      data: {
        advisorId,
        clientId: client ? client.id : 'placeholder-id-for-invite', // Mock for pending
        status: 'PENDING',
      }
    });

    // 2. Trigger email (mocked)
    return {
      invitationId: relationship.id,
      status: relationship.status,
      message: `Invitation sent to ${email}`,
    };
  }

  async getClients(advisorId: string, tenantId: string) {
    const relationships = await this.prisma.advisorClient.findMany({
      where: { advisorId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            kycStatus: true,
          }
        },
      }
    });

    return relationships.map(r => ({
      clientId: r.clientId,
      name: r.client.name,
      email: r.client.email,
      kycStatus: r.client.kycStatus,
      status: r.status,
      permissions: r.permissions,
      since: r.createdAt,
    }));
  }

  async getClientPortfolioSummary(advisorId: string, clientId: string) {
    // Verify access
    const relationship = await this.prisma.advisorClient.findUnique({
      where: {
        advisorId_clientId: {
          advisorId,
          clientId,
        }
      }
    });

    if (!relationship || relationship.status !== 'ACTIVE') {
      throw new NotFoundException('Client relationship not found or inactive');
    }

    // Return mock summary logic for advisor dashboard
    return {
      clientId,
      totalAUM: 5400000,
      activePortfolios: 2,
      lastSync: new Date(),
    };
  }
}
