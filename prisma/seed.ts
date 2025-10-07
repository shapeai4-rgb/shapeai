import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Initialize Prisma Client
const prisma = new PrismaClient();

const saltRounds = 10;

async function main() {
  console.log(`Start seeding ...`);

  // --- 1. Clean up existing data ---
  console.log('Deleting existing meal plans and users...');
  // Delete meal plans first due to the relation
  await prisma.mealPlan.deleteMany();
  // We need to delete accounts and sessions before users
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany();
  console.log('Existing data deleted.');

  // --- 2. Hash a password to be used for both users ---
  const hashedPassword = await bcrypt.hash('password123', saltRounds);
  console.log('Test password hashed.');

  // --- 3. Create a user with a positive token balance ---
  const userWithTokens = await prisma.user.create({
    data: {
      email: 'user-with-tokens@example.com',
      firstName: 'Alice',
      lastName: 'Johnson',
      hashedPassword: hashedPassword,
      tokenBalance: 100, // This user can generate plans
    },
  });
  console.log(`Created user with tokens: ${userWithTokens.email}`);

  // --- 4. Create a user with zero token balance ---
  const userWithoutTokens = await prisma.user.create({
    data: {
      email: 'user-without-tokens@example.com',
      firstName: 'Bob',
      lastName: 'Smith',
      hashedPassword: hashedPassword,
      tokenBalance: 0, // This user cannot generate plans
    },
  });
  console.log(`Created user without tokens: ${userWithoutTokens.email}`);

  // --- 5. Create a sample meal plan for the first user ---
  const sampleMealPlanContent = {
    day1: {
      breakfast: { title: "Overnight Oats", kcal: 450 },
      lunch: { title: "Chicken Salad Wrap", kcal: 550 },
      dinner: { title: "Baked Salmon with Asparagus", kcal: 650 },
    },
  };

  await prisma.mealPlan.create({
    data: {
      userId: userWithTokens.id, // Link to the user with tokens
      content: sampleMealPlanContent,
      title: 'My First AI Plan',
      days: 1,
      kcalTarget: 1650,
      status: 'Active',
      dietTags: ['high-protein', 'quick-meals'],
    },
  });
  console.log(`Created a sample meal plan for ${userWithTokens.email}`);
  
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma Client connection
    await prisma.$disconnect();
  });