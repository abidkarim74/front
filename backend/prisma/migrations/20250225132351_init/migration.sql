-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE',
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "vehiclePic" TEXT;
