/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('male', 'female');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" SMALLINT NOT NULL DEFAULT 1,
    "sex" "Sex" NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "birthDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "studentId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "present" BOOLEAN NOT NULL DEFAULT false,
    "bible" BOOLEAN NOT NULL DEFAULT false,
    "notebook" BOOLEAN NOT NULL DEFAULT false,
    "pen" BOOLEAN NOT NULL DEFAULT false,
    "quiz" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("studentId","date")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "biblePoints" INTEGER NOT NULL DEFAULT 0,
    "notebookPoints" INTEGER NOT NULL DEFAULT 0,
    "penPoints" INTEGER NOT NULL DEFAULT 0,
    "quizPoints" INTEGER NOT NULL DEFAULT 0,
    "groupGoal" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
