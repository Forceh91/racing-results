/*
  Warnings:

  - A unique constraint covering the columns `[driver_uuid,event_uuid,event_result_number]` on the table `AggreatedResultEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AggreatedResultEntry_driver_uuid_event_uuid_event_result_nu_key" ON "AggreatedResultEntry"("driver_uuid", "event_uuid", "event_result_number");
