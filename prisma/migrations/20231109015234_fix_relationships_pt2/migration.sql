/*
  Warnings:

  - A unique constraint covering the columns `[result_entry_uuid]` on the table `FastestLap` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `result_entry_uuid` to the `FastestLap` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FastestLap" ADD COLUMN     "result_entry_uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FastestLap_result_entry_uuid_key" ON "FastestLap"("result_entry_uuid");
