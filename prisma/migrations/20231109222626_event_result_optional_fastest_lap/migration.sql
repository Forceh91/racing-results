-- DropForeignKey
ALTER TABLE "EventResult" DROP CONSTRAINT "EventResult_fastest_lap_uuid_fkey";

-- AlterTable
ALTER TABLE "EventResult" ALTER COLUMN "fastest_lap_uuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EventResult" ADD CONSTRAINT "EventResult_fastest_lap_uuid_fkey" FOREIGN KEY ("fastest_lap_uuid") REFERENCES "FastestLap"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
