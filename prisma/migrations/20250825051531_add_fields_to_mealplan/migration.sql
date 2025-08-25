/*
  Warnings:

  - Added the required column `days` to the `MealPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kcalTarget` to the `MealPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `MealPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `MealPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MealPlan" ADD COLUMN     "days" INTEGER NOT NULL,
ADD COLUMN     "dietTags" TEXT[],
ADD COLUMN     "kcalTarget" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
