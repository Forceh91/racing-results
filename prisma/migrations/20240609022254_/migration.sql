/*
  Warnings:

  - A unique constraint covering the columns `[driver_uuid,event_result_uuid]` on the table `ResultEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ResultEntry_driver_uuid_event_result_uuid_key" ON "ResultEntry"("driver_uuid", "event_result_uuid");
