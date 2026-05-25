import { Controller, Post, Get, Param, Body, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { ImportSourceType } from '@prisma/client';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  // FR-6: Document-Based Imports
  @Post('document')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 25 * 1024 * 1024 } // FR-6.4: 25 MB max size
  }))
  async importDocument(
    @Req() req: any, 
    @UploadedFile() file: Express.Multer.File,
    @Body('password') password?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const userId = req.user?.id || 'mock-user-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';

    return this.importService.processDocumentUpload(userId, tenantId, file, password);
  }

  // FR-7: Institutional Connectivity Registry
  @Get('connectors')
  getConnectors() {
    return this.importService.getConnectorRegistry();
  }

  // FR-4.2: Start PAN aggregation with period selection
  @Post('pan/aggregate')
  async startPanAggregation(
    @Req() req: any,
    @Body() body: { pan: string; portfolioId: string; importPeriod: string },
  ) {
    if (!body.pan || body.pan.length !== 10) {
      throw new BadRequestException('Valid 10-character PAN is required');
    }
    if (!body.portfolioId) {
      throw new BadRequestException('portfolioId is required');
    }

    const userId = req.user?.id || 'mock-user-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';

    return this.importService.startPanAggregation(
      userId,
      tenantId,
      body.pan,
      body.portfolioId,
      body.importPeriod || 'all_time',
    );
  }

  // FR-4.4: Get per-source aggregation status (polling endpoint)
  @Get('pan/aggregate/:jobId')
  async getAggregationStatus(@Param('jobId') jobId: string, @Req() req: any) {
    const userId = req.user?.id || 'mock-user-id';
    return this.importService.getAggregationStatus(jobId, userId);
  }

  // Legacy PAN sync
  @Post('pan/sync')
  async syncPanLinkedAccounts(@Req() req: any, @Body('pan') pan: string) {
    if (!pan) {
      throw new BadRequestException('PAN is required for aggregation sync');
    }
    const userId = req.user?.id || 'mock-user-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';

    return this.importService.syncPanLinkedAccounts(userId, tenantId, pan);
  }

  @Post('broker/sync')
  async syncBroker(@Req() req: any, @Body() body: { brokerType: ImportSourceType, credentials: any }) {
    const userId = req.user?.id || 'mock-user-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';

    return this.importService.startBrokerSync(userId, tenantId, body.brokerType, body.credentials);
  }

  @Get('job/:id')
  getJobStatus(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'mock-user-id';
    return this.importService.getJobStatus(id, userId);
  }
}
