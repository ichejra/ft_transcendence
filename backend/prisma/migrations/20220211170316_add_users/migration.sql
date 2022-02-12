/*
  Warnings:

  - Made the column `email` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "state" BOOLEAN DEFAULT false,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "active_2fa" SET DEFAULT false;
