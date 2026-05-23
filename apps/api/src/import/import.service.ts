import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ImportSourceType, ImportJobStatus, TransactionType } from '@prisma/client';
import { TransactionService } from '../transaction/transaction.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(
    private prisma: PrismaService,
    private transactionService: TransactionService,
  ) {}

  async startCASImport(userId: string, tenantId: string, fileBuffer: Buffer, password?: string) {
    // 1. Create a job record
    const job = await this.prisma.importJob.create({
      data: {
        userId,
        sourceType: ImportSourceType.CAS_STATEMENT,
        status: ImportJobStatus.QUEUED,
        fileName: 'cas_statement.pdf',
        metadata: { passwordProvided: !!password },
      }
    });

    // 2. Queue the actual processing (would use BullMQ here in production)
    // this.queue.add('process-cas', { jobId: job.id, fileBuffer, password });
    
    // For now, let's mock successful queueing
    return {
      jobId: job.id,
      status: job.status,
      message: 'CAS import job queued successfully. It may take a few moments to process.',
    };
  }

  async startBrokerSync(userId: string, tenantId: string, brokerType: ImportSourceType, credentials: any) {
    if (!([ImportSourceType.BROKER_API, ImportSourceType.INSTITUTIONAL] as ImportSourceType[]).includes(brokerType)) {
      throw new BadRequestException('Invalid broker type for sync');
    }

    const job = await this.prisma.importJob.create({
      data: {
        userId,
        sourceType: brokerType,
        status: ImportJobStatus.QUEUED,
        metadata: { brokerType },
      }
    });

    return {
      jobId: job.id,
      status: job.status,
      message: `${brokerType} sync initiated.`,
    };
  }

  async getJobStatus(jobId: string, userId: string) {
    const job = await this.prisma.importJob.findUnique({
      where: { id: jobId }
    });

    if (!job || job.userId !== userId) {
      throw new NotFoundException('Import job not found');
    }

    return job;
  }
}
