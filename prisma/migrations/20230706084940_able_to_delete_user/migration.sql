-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_belongsToId_fkey";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
