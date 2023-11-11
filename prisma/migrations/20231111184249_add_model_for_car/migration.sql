/*
  Warnings:

  - You are about to drop the column `car` on the `AggreatedResultEntry` table. All the data in the column will be lost.
  - You are about to drop the column `car` on the `ResultEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AggreatedResultEntry" DROP COLUMN "car",
ADD COLUMN     "car_uuid" TEXT;

-- AlterTable
ALTER TABLE "ResultEntry" DROP COLUMN "car",
ADD COLUMN     "car_uuid" TEXT;

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_uuid_key" ON "Car"("uuid");

-- AddForeignKey
ALTER TABLE "ResultEntry" ADD CONSTRAINT "ResultEntry_car_uuid_fkey" FOREIGN KEY ("car_uuid") REFERENCES "Car"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggreatedResultEntry" ADD CONSTRAINT "AggreatedResultEntry_car_uuid_fkey" FOREIGN KEY ("car_uuid") REFERENCES "Car"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
