-- CreateTable
CREATE TABLE "Penalty" (
    "id" SERIAL NOT NULL,
    "driver_uuid" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "event_result_uuid" TEXT NOT NULL,

    CONSTRAINT "Penalty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_driver_uuid_fkey" FOREIGN KEY ("driver_uuid") REFERENCES "Driver"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_event_result_uuid_fkey" FOREIGN KEY ("event_result_uuid") REFERENCES "EventResult"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
