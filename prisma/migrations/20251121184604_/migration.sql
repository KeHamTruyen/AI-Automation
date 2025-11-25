/*
  Warnings:

  - You are about to alter the column `n8nCredentialId` on the `social_accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(191)`.
  - You are about to alter the column `n8nCredentialName` on the `social_accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(191)`.
  - You are about to alter the column `n8nWorkflowId` on the `social_accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(191)`.
  - You are about to alter the column `n8nWorkflowName` on the `social_accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(191)`.
  - You are about to alter the column `n8nWebhookUrl` on the `social_accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(512)`.

*/
-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "social_accounts" ALTER COLUMN "n8nCredentialId" SET DATA TYPE VARCHAR(191),
ALTER COLUMN "n8nCredentialName" SET DATA TYPE VARCHAR(191),
ALTER COLUMN "n8nWorkflowId" SET DATA TYPE VARCHAR(191),
ALTER COLUMN "n8nWorkflowName" SET DATA TYPE VARCHAR(191),
ALTER COLUMN "n8nWebhookUrl" SET DATA TYPE VARCHAR(512);

-- DropEnum
DROP TYPE "ExecutionStatus";

-- CreateTable
CREATE TABLE "content_publish_targets" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_publish_targets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_publish_targets_contentId_socialAccountId_key" ON "content_publish_targets"("contentId", "socialAccountId");

-- AddForeignKey
ALTER TABLE "content_publish_targets" ADD CONSTRAINT "content_publish_targets_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_publish_targets" ADD CONSTRAINT "content_publish_targets_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "social_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
