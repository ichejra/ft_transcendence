/*
  Warnings:

  - You are about to drop the column `active_2fa` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "active_2fa",
ADD COLUMN     "activated" BOOLEAN DEFAULT false,
ALTER COLUMN "email" DROP NOT NULL;
