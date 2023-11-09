-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CIRCUIT', 'RALLY');

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Circuit" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "first_event" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Circuit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventResult" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "ranked" BOOLEAN NOT NULL,
    "type" "EventType" NOT NULL,
    "event_uuid" TEXT NOT NULL,
    "circuit_uuid" TEXT NOT NULL,
    "fastest_lap_uuid" TEXT NOT NULL,

    CONSTRAINT "EventResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FastestLap" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "driver_uuid" TEXT NOT NULL,
    "event_result_uuid" TEXT NOT NULL,
    "circuit_uuid" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "lap" INTEGER,

    CONSTRAINT "FastestLap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultEntry" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "driver_uuid" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "laps" INTEGER,
    "time" INTEGER NOT NULL,
    "car" TEXT,
    "grid" INTEGER,
    "event_uuid" TEXT NOT NULL,
    "fastest_lap_uuid" TEXT NOT NULL,
    "team_uuid" TEXT NOT NULL,
    "fastestLapId" INTEGER,

    CONSTRAINT "ResultEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_uuid_key" ON "Driver"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Team_uuid_key" ON "Team"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Event_uuid_key" ON "Event"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Circuit_uuid_key" ON "Circuit"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "EventResult_uuid_key" ON "EventResult"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "EventResult_fastest_lap_uuid_key" ON "EventResult"("fastest_lap_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "FastestLap_uuid_key" ON "FastestLap"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ResultEntry_uuid_key" ON "ResultEntry"("uuid");

-- AddForeignKey
ALTER TABLE "EventResult" ADD CONSTRAINT "EventResult_event_uuid_fkey" FOREIGN KEY ("event_uuid") REFERENCES "Event"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventResult" ADD CONSTRAINT "EventResult_circuit_uuid_fkey" FOREIGN KEY ("circuit_uuid") REFERENCES "Circuit"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventResult" ADD CONSTRAINT "EventResult_fastest_lap_uuid_fkey" FOREIGN KEY ("fastest_lap_uuid") REFERENCES "FastestLap"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FastestLap" ADD CONSTRAINT "FastestLap_driver_uuid_fkey" FOREIGN KEY ("driver_uuid") REFERENCES "Driver"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FastestLap" ADD CONSTRAINT "FastestLap_circuit_uuid_fkey" FOREIGN KEY ("circuit_uuid") REFERENCES "Circuit"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultEntry" ADD CONSTRAINT "ResultEntry_driver_uuid_fkey" FOREIGN KEY ("driver_uuid") REFERENCES "Driver"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultEntry" ADD CONSTRAINT "ResultEntry_event_uuid_fkey" FOREIGN KEY ("event_uuid") REFERENCES "EventResult"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultEntry" ADD CONSTRAINT "ResultEntry_fastestLapId_fkey" FOREIGN KEY ("fastestLapId") REFERENCES "FastestLap"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultEntry" ADD CONSTRAINT "ResultEntry_team_uuid_fkey" FOREIGN KEY ("team_uuid") REFERENCES "Team"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
