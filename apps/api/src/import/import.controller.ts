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
