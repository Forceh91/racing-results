/*
  Warnings:

  - You are about to drop the column `event_result_order` on the `EventResult` table. All the data in the column will be lost.
  - You are about to drop the column `event_uuid` on the `ResultEntry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ResultEntry" DROP CONSTRAINT "ResultEntry_event_uuid_fkey";

-- AlterTable
ALTER TABLE "EventResult" DROP COLUMN "event_result_order",
ADD COLUMN     "event_result_number" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "ResultEntry" DROP COLUMN "event_uuid",
ADD COLUMN     "event_result_uuid" TEXT;

-- CreateTable
CREATE TABLE "AggreatedResultEntry" (
    "id" SERIAL NOT NULL,
    "driver_uuid" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "car" TEXT,
    "event_uuid" TEXT,
    "event_result_number" INTEGER NOT NULL,
    "team_uuid" TEXT,

    CONSTRAINT "AggreatedResultEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResultEntry" ADD CONSTRAINT "ResultEntry_event_result_uuid_fkey" FOREIGN KEY ("event_result_uuid") REFERENCES "EventResult"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggreatedResultEntry" ADD CONSTRAINT "AggreatedResultEntry_driver_uuid_fkey" FOREIGN KEY ("driver_uuid") REFERENCES "Driver"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggreatedResultEntry" ADD CONSTRAINT "AggreatedResultEntry_event_uuid_fkey" FOREIGN KEY ("event_uuid") REFERENCES "Event"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggreatedResultEntry" ADD CONSTRAINT "AggreatedResultEntry_team_uuid_fkey" FOREIGN KEY ("team_uuid") REFERENCES "Team"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
