/*
  Warnings:

  - You are about to drop the column `socialAccountId` on the `contents` table. All the data in the column will be lost.
  - You are about to drop the `content_publish_targets` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('SUCCESS', 'FAIL');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'ERROR', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'ERROR', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "content_publish_targets" DROP CONSTRAINT "content_publish_targets_contentId_fkey";

-- DropForeignKey
ALTER TABLE "content_publish_targets" DROP CONSTRAINT "content_publish_targets_socialAccountId_fkey";

-- DropForeignKey
ALTER TABLE "contents" DROP CONSTRAINT "contents_socialAccountId_fkey";

-- AlterTable
ALTER TABLE "contents" DROP COLUMN "socialAccountId";

-- AlterTable
ALTER TABLE "social_accounts" ALTER COLUMN "n8nCredentialId" SET DATA TYPE TEXT,
ALTER COLUMN "n8nCredentialName" SET DATA TYPE TEXT,
ALTER COLUMN "n8nWorkflowId" SET DATA TYPE TEXT,
ALTER COLUMN "n8nWorkflowName" SET DATA TYPE TEXT,
ALTER COLUMN "n8nWebhookUrl" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "content_publish_targets";

-- DropEnum
DROP TYPE "PublishStatus";

-- CreateTable
CREATE TABLE "ScheduledPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentText" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'facebook',
    "platforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "media" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "externalResults" JSONB,
    "recurrenceRule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "draftContentId" TEXT,

    CONSTRAINT "ScheduledPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledPostAttempt" (
    "id" TEXT NOT NULL,
    "scheduledPostId" TEXT NOT NULL,
    "attemptNo" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "executionId" TEXT,
    "platformResults" JSONB,

    CONSTRAINT "ScheduledPostAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPublication" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "status" "PublicationStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "externalPostId" TEXT,
    "errorMessage" TEXT,
    "captionOverride" TEXT,
    "mediaOverride" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPublication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentPublication_contentId_idx" ON "ContentPublication"("contentId");

-- CreateIndex
CREATE INDEX "ContentPublication_socialAccountId_idx" ON "ContentPublication"("socialAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentPublication_contentId_socialAccountId_key" ON "ContentPublication"("contentId", "socialAccountId");

-- AddForeignKey
ALTER TABLE "ScheduledPost" ADD CONSTRAINT "ScheduledPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledPost" ADD CONSTRAINT "ScheduledPost_draftContentId_fkey" FOREIGN KEY ("draftContentId") REFERENCES "contents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledPostAttempt" ADD CONSTRAINT "ScheduledPostAttempt_scheduledPostId_fkey" FOREIGN KEY ("scheduledPostId") REFERENCES "ScheduledPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPublication" ADD CONSTRAINT "ContentPublication_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPublication" ADD CONSTRAINT "ContentPublication_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "social_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
