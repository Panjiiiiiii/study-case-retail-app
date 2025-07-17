-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "unitId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
