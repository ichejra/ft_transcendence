/*
  Warnings:

  - You are about to drop the column `first_name` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "first_name",
DROP COLUMN "last_name";
