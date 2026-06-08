/*
  Warnings:

  - You are about to drop the column `date` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `remaining` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `total_fixed_expenses` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `total_income` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `total_savings` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `total_variable_expenses` on the `Budget` table. All the data in the column will be lost.
  - Added the required column `month` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'FIXED', 'VARIABLE', 'SAVING');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('SALARY', 'PARTNER_SALARY', 'RENTAL_INCOME', 'OTHER_INCOME', 'HOUSING', 'PROPERTY_TAXES', 'HOME_INSURANCE', 'ELECTRICITY', 'WATER', 'GAS', 'INTERNET_CABLE_PHONE', 'CAR_PAYMENT', 'GASOLINE_FUEL', 'INSURANCE', 'PUBLIC_TRANSPORTATION', 'LOAN_PAYMENTS', 'STUDENT_LOANS', 'CREDIT_CARD_PAYMENT', 'PERSONAL_LOAN', 'HEALTH_INSURANCE', 'PRESCRIPTION_MEDICATIONS', 'HEALTH_RELATED_EXPENSES', 'SUBSCRIPTIONS', 'STREAMING_SERVICES', 'MAGAZINES', 'GROCERIES', 'DINING_OUT_ENTERTAINMENT', 'EMERGENCY_FUND', 'RETIREMENT_SAVING', 'OTHER_SAVINGS_INVESTMENTS', 'OTHERS');

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "date",
DROP COLUMN "remaining",
DROP COLUMN "total_fixed_expenses",
DROP COLUMN "total_income",
DROP COLUMN "total_savings",
DROP COLUMN "total_variable_expenses",
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "category" "CategoryType" NOT NULL,
    "label" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "TransactionType" NOT NULL,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
