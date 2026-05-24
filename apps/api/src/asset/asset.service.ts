import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssetCategory, AssetType } from '@prisma/client';

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(query: { category?: AssetCategory; search?: string }) {
    return this.prisma.asset.findMany({
      where: {
        isActive: true,
        ...(query.category && { category: query.category }),
        ...(query.search && {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { symbol: { contains: query.search, mode: 'insensitive' } },
            { isin: { contains: query.search, mode: 'insensitive' } },
          ],
        }),
      },
      take: 50,
    });
  }

  async findOne(id: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
    });
    
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    
    return asset;
  }

  async findByIsin(isin: string) {
    let asset = await this.prisma.asset.findUnique({
      where: { isin },
    });
    
    if (!asset) {
      this.logger.log(`Asset with ISIN ${isin} not found locally. Mocking external API resolution...`);
      // Mock external data resolution
      const isEquity = isin.startsWith('INE');
      
      asset = await this.prisma.asset.create({
        data: {
          isin,
          name: `Resolved Asset ${isin}`,
          symbol: `SYM${isin.substring(3, 7)}`,
          assetType: isEquity ? AssetType.EQUITY : AssetType.MUTUAL_FUND,
          category: isEquity ? AssetCategory.EQUITY : AssetCategory.DEBT,
          exchange: isEquity ? 'NSE' : undefined,
          metadata: { resolvedSource: 'MockExternalAPI' }
        }
      });
    }
    
    return asset;
  }
}
