import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  console.log('Starting seed...');

  // Seed gifts
  const gifts = [
    { name: 'Planter' },
    { name: 'Scented Candles' },
    { name: 'Fidget Toys' },
    { name: 'Vase' },
    { name: 'Table Lamp' },
    { name: 'Photo Frame' },
  ];

  for (const gift of gifts) {
    const existingGift = await prisma.gift.findFirst({
      where: { name: gift.name },
    });

    if (!existingGift) {
      await prisma.gift.create({
        data: {
          name: gift.name,
          // category: gift.category,
          quantity: 10,
          available: true,
        },
      });
      console.log(`✅ Created gift: ${gift.name}`);
    } else {
      console.log(`⏭️  Gift already exists: ${gift.name}`);
    }
  }

  console.log('Seed completed!');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
