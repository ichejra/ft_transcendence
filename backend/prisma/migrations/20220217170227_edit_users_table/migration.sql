/*
  Warnings:

  - You are about to drop the column `activated` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "activated",
ADD COLUMN     "is_active" BOOLEAN DEFAULT false;
