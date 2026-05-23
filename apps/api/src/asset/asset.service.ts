import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssetCategory, AssetType } from '@prisma/client';

@Injectable()
export class AssetService {
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
    const asset = await this.prisma.asset.findUnique({
      where: { isin },
    });
    
    if (!asset) {
      throw new NotFoundException(`Asset with ISIN ${isin} not found`);
    }
    
    return asset;
  }
}
