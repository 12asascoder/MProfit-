import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    holding: {
      findMany: jest.fn(),
    },
    transaction: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAssetAllocation', () => {
    it('should calculate allocation percentages correctly', async () => {
      // Mock holdings data
      mockPrismaService.holding.findMany.mockResolvedValue([
        { asset: { category: 'EQUITY' }, currentValue: 6000 },
        { asset: { category: 'DEBT' }, currentValue: 3000 },
        { asset: { category: 'GOLD' }, currentValue: 1000 },
      ]);

      const result = await service.getAssetAllocation('user-1', 'portfolio-1');

      expect(result).toEqual([
        { category: 'EQUITY', value: 6000, percentage: 60 },
        { category: 'DEBT', value: 3000, percentage: 30 },
        { category: 'GOLD', value: 1000, percentage: 10 },
      ]);

      expect(mockPrismaService.holding.findMany).toHaveBeenCalledWith({
        where: {
          portfolio: { userId: 'user-1', id: 'portfolio-1' },
          quantity: { gt: 0 }
        },
        include: { asset: true },
      });
    });

    it('should return empty array if no holdings', async () => {
      mockPrismaService.holding.findMany.mockResolvedValue([]);

      const result = await service.getAssetAllocation('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return mocked performance metrics', async () => {
      const metrics = await service.getPerformanceMetrics('user-1');

      expect(metrics).toBeDefined();
      expect(metrics.cagr).toBe(12.5);
      expect(metrics.xirr).toBe(15.2);
    });
  });
});
