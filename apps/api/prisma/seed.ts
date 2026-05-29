import { PrismaClient, AssetType, AssetCategory, TransactionType, PortfolioType, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  // Clean up existing data to ensure idempotent seed
  await prisma.taxLot.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.holding.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.asset.deleteMany();

  console.log('Cleared existing data.');

  // 0. Create Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Default Tenant',
      slug: 'default',
    }
  });

  // 1. Create Assets
  const hdfc = await prisma.asset.create({
    data: {
      assetType: AssetType.EQUITY,
      category: AssetCategory.EQUITY,
      isin: 'INE040A01034',
      symbol: 'HDFCBANK',
      exchange: 'NSE',
      name: 'HDFC Bank Ltd.',
    }
  });

  const sbiBond = await prisma.asset.create({
    data: {
      assetType: AssetType.BOND,
      category: AssetCategory.DEBT,
      isin: 'INE062A08314',
      symbol: 'SBIBOND',
      exchange: 'NSE',
      name: 'SBI Long Term Bond',
    }
  });

  // 2. Create User (Arnav Puggal)
  const user = await prisma.user.create({
    data: {
      name: 'Arnav Puggal',
      panHash: 'IVIPP3201F', // Normally hashed, but keeping raw here for demo login
      email: 'arnav.puggal@example.com',
      phone: '9876543210',
      passwordHash: 'seeded-hash', // dummy value
      role: UserRole.INVESTOR,
      tenantId: tenant.id,
    }
  });

  // 3. Create Portfolio
  const portfolio = await prisma.portfolio.create({
    data: {
      userId: user.id,
      tenantId: tenant.id,
      name: 'Primary Portfolio',
      type: PortfolioType.INDIVIDUAL,
    }
  });

  // 4. Create Holdings & Transactions
  // HDFC Holding
  const hdfcHolding = await prisma.holding.create({
    data: {
      portfolioId: portfolio.id,
      assetId: hdfc.id,
      quantity: 500,
      averageCost: 1450,
      currentValue: 1650 * 500,
      investedValue: 1450 * 500,
      unrealizedGain: (1650 - 1450) * 500,
    }
  });

  // Grandfathered Transaction (Pre Jan 31 2018)
  const hdfcBuyPre2018 = await prisma.transaction.create({
    data: {
      portfolioId: portfolio.id,
      assetId: hdfc.id,
      type: TransactionType.BUY,
      date: new Date('2017-06-15T10:00:00Z'),
      quantity: 300,
      price: 900,
      amount: 900 * 300,
    }
  });

  // Recent Transaction
  const hdfcBuyRecent = await prisma.transaction.create({
    data: {
      portfolioId: portfolio.id,
      assetId: hdfc.id,
      type: TransactionType.BUY,
      date: new Date('2023-11-20T10:00:00Z'),
      quantity: 200,
      price: 1550,
      amount: 1550 * 200,
    }
  });

  // SBI Bond Holding
  const sbiHolding = await prisma.holding.create({
    data: {
      portfolioId: portfolio.id,
      assetId: sbiBond.id,
      quantity: 100,
      averageCost: 1000,
      currentValue: 1150 * 100,
      investedValue: 1000 * 100,
      unrealizedGain: (1150 - 1000) * 100,
    }
  });

  const sbiBuy = await prisma.transaction.create({
    data: {
      portfolioId: portfolio.id,
      assetId: sbiBond.id,
      type: TransactionType.BUY,
      date: new Date('2020-04-10T10:00:00Z'),
      quantity: 100,
      price: 1000,
      amount: 1000 * 100,
    }
  });

  // 5. Create Tax Lots
  await prisma.taxLot.create({
    data: {
      holdingId: hdfcHolding.id,
      assetId: hdfc.id,
      acquisitionDate: hdfcBuyPre2018.date,
      quantity: 300,
      totalCost: 900 * 300,
      costBasis: 900,
      remainingQuantity: 300,
      isGrandfathered: true,
      grandfatheredFMV: 1100, // Jan 31 2018 FMV
    }
  });

  await prisma.taxLot.create({
    data: {
      holdingId: hdfcHolding.id,
      assetId: hdfc.id,
      acquisitionDate: hdfcBuyRecent.date,
      quantity: 200,
      totalCost: 1550 * 200,
      costBasis: 1550,
      remainingQuantity: 200,
    }
  });

  await prisma.taxLot.create({
    data: {
      holdingId: sbiHolding.id,
      assetId: sbiBond.id,
      acquisitionDate: sbiBuy.date,
      quantity: 100,
      totalCost: 1000 * 100,
      costBasis: 1000,
      remainingQuantity: 100,
    }
  });

  // Add a SELL transaction to show realized STCG/LTCG
  const hdfcSell = await prisma.transaction.create({
    data: {
      portfolioId: portfolio.id,
      assetId: hdfc.id,
      type: TransactionType.SELL,
      date: new Date('2024-05-15T10:00:00Z'),
      quantity: 50,
      price: 1700,
      amount: 1700 * 50,
    }
  });

  // Adjust tax lot for the sell (FIFO assumes we sold 50 from the 300 pre-2018 lot)
  await prisma.taxLot.updateMany({
    where: {
      holdingId: hdfcHolding.id,
      costBasis: 900,
    },
    data: {
      remainingQuantity: 250,
    }
  });

  console.log(`Seed completed successfully. Demo User Arnav Puggal with PAN: IVIPP3201F created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
