import { Controller, Get, Param, Query } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetCategory } from '@prisma/client';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  findAll(
    @Query('category') category?: AssetCategory,
    @Query('search') search?: string,
  ) {
    return this.assetService.findAll({ category, search });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }

  @Get('isin/:isin')
  findByIsin(@Param('isin') isin: string) {
    return this.assetService.findByIsin(isin);
  }
}
