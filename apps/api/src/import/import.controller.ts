import { Controller, Post, Get, Param, Body, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { ImportSourceType } from '@prisma/client';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('cas')
  @UseInterceptors(FileInterceptor('file'))
  async importCAS(
    @Req() req: any, 
    @UploadedFile() file: Express.Multer.File,
    @Body('password') password?: string,
  ) {
    if (!file) {
      throw new BadRequestException('CAS PDF file is required');
    }
    
    const userId = req.user?.id || 'mock-user-id';
    const tenantId = req.user?.tenantId || 'mock-tenant-id';

    return this.importService.startCASImport(userId, tenantId, file.buffer, password);
  }

  @Post('pan/sync')
  async syncPanLinkedAccounts(@Req() req: any, @Body('pan') pan: string) {
    if (!pan) {
      throw new BadRequestException('PAN is required for aggregation sync');
    }
    // req.user is guaranteed to exist due to JwtAuthGuard, unless decorated with @Public()
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;

    return this.importService.syncPanLinkedAccounts(userId, tenantId, pan);
  }

  @Post('broker/sync')
  async syncBroker(@Req() req: any, @Body() body: { brokerType: ImportSourceType, credentials: any }) {
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;

    return this.importService.startBrokerSync(userId, tenantId, body.brokerType, body.credentials);
  }

  @Get('job/:id')
  getJobStatus(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.importService.getJobStatus(id, userId);
  }
}
