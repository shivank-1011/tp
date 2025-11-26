/*
  Warnings:

  - You are about to drop the column `family_name` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Author` table. All the data in the column will be lost.
  - You are about to alter the column `lifespan` on the `Author` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `ISBN` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Genre` table. All the data in the column will be lost.
  - You are about to drop the `_BookToGenre` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `date_of_birth` on table `Author` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `isbn` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_BookToGenre` DROP FOREIGN KEY `_BookToGenre_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BookToGenre` DROP FOREIGN KEY `_BookToGenre_B_fkey`;

-- AlterTable
ALTER TABLE `Author` DROP COLUMN `family_name`,
    DROP COLUMN `first_name`,
    DROP COLUMN `url`,
    MODIFY `date_of_birth` DATETIME(3) NOT NULL,
    MODIFY `lifespan` INTEGER NULL;

-- AlterTable
ALTER TABLE `Book` DROP COLUMN `ISBN`,
    DROP COLUMN `url`,
    ADD COLUMN `isbn` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Genre` DROP COLUMN `url`;

-- DropTable
DROP TABLE `_BookToGenre`;

-- CreateTable
CREATE TABLE `BookGenreMapping` (
    `bookId` INTEGER NOT NULL,
    `genreId` INTEGER NOT NULL,

    PRIMARY KEY (`bookId`, `genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookGenreMapping` ADD CONSTRAINT `BookGenreMapping_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookGenreMapping` ADD CONSTRAINT `BookGenreMapping_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `Genre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
