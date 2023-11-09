/*
  Warnings:

  - You are about to drop the column `fastestLapId` on the `ResultEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fastest_lap_uuid]` on the table `ResultEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ResultEntry" DROP CONSTRAINT "ResultEntry_fastestLapId_fkey";

-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "created" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ResultEntry" DROP COLUMN "fastestLapId";

-- CreateIndex
CREATE UNIQUE INDEX "ResultEntry_fastest_lap_uuid_key" ON "ResultEntry"("fastest_lap_uuid");

-- AddForeignKey
ALTER TABLE "ResultEntry" ADD CONSTRAINT "ResultEntry_fastest_lap_uuid_fkey" FOREIGN KEY ("fastest_lap_uuid") REFERENCES "FastestLap"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
