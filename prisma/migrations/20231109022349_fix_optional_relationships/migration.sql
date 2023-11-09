-- DropForeignKey
ALTER TABLE "ResultEntry" DROP CONSTRAINT "ResultEntry_event_uuid_fkey";

-- DropForeignKey
ALTER TABLE "ResultEntry" DROP CONSTRAINT "ResultEntry_fastest_lap_uuid_fkey";

-- DropForeignKey
ALTER TABLE "ResultEntry" DROP CONSTRAINT "ResultEntry_team_uuid_fkey";

-- AlterTable
ALTER TABLE "FastestLap" ALTER COLUMN "event_result_uuid" DROP NOT NULL,
ALTER COLUMN "result_entry_uuid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ResultEntry" ALTER COLUMN "event_uuid" DROP NOT NULL,
ALTER COLUMN "fastest_lap_uuid" DROP NOT NULL,
ALTER COLUMN "team_uuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ResultEntry" ADD CONSTRAINT "ResultEntry_event_uuid_fkey" FOREIGN KEY ("event_uuid") REFERENCES "EventResult"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultEntry" ADD CONSTRAINT "ResultEntry_fastest_lap_uuid_fkey" FOREIGN KEY ("fastest_lap_uuid") REFERENCES "FastestLap"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultEntry" ADD CONSTRAINT "ResultEntry_team_uuid_fkey" FOREIGN KEY ("team_uuid") REFERENCES "Team"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
