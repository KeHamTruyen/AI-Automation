-- AlterTable
ALTER TABLE "contents" ADD COLUMN     "media" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "social_accounts" ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "clientSecret" TEXT;
