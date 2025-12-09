-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('BOOK', 'DVD', 'TOOL', 'MAGAZINE');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "type" "ItemType";
