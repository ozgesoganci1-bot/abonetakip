/*
  Warnings:

  - Added the required column `currentPeriodEnd` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3) NOT NULL;
