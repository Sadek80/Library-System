CREATE DATABASE Library;
USE Library;

CREATE TABLE `borrowed_books`(
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `book_id` BIGINT NOT NULL,
    `borrower_id` BIGINT NOT NULL,
    `borrow_date` DATE NOT NULL,
    `due_date` DATE NOT NULL,
    `return_date` DATE NULL,
    `is_returned` BOOLEAN DEFAULT FALSE
);
    
ALTER TABLE
    `borrowed_books` ADD INDEX `borrowed_books_book_id_index`(`book_id`);
ALTER TABLE
    `borrowed_books` ADD INDEX `borrowed_books_borrower_id_index`(`borrower_id`);
ALTER TABLE
    `borrowed_books` ADD INDEX `borrowed_books_borrow_date_index`(`borrow_date`);
ALTER TABLE
    `borrowed_books` ADD INDEX `borrowed_books_due_date_index`(`due_date`);
ALTER TABLE
    `borrowed_books` ADD INDEX `borrowed_books_is_returned_index`(`is_returned`);

ALTER TABLE
    `borrowed_books` ADD INDEX `borrowed_books_borrower_id_book_id_is_returned_index`(`borrower_id`, `book_id`, `is_returned`);

CREATE TABLE `borrowers`(
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
    `password_hash` TEXT NOT NULL
);

CREATE TABLE `books`(
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `author` VARCHAR(50) NOT NULL,
    `isbn` VARCHAR(13) NOT NULL UNIQUE,
    `available_quantity` INT NOT NULL,
    `shelf_location` MEDIUMTEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
    `title` VARCHAR(255) NOT NULL
);

ALTER TABLE
    `books` ADD INDEX `books_author_index`(`author`);
ALTER TABLE
    `books` ADD INDEX `books_isbn_index`(`isbn`);
ALTER TABLE
    `books` ADD INDEX `books_title_index`(`title`);

ALTER TABLE
    `books` ADD INDEX `books_title_author_index`(`title`, `author`);

ALTER TABLE
    `books` ADD INDEX `books_title_isbn_index`(`title`, `isbn`);

ALTER TABLE
    `books` ADD INDEX `books_author_isbn_index`(`author`, `isbn`);

ALTER TABLE
    `books` ADD INDEX `books_title_author_isbn_index`(`title`, `author`, `isbn`);

ALTER TABLE
    `borrowed_books` ADD CONSTRAINT `borrowed_books_borrower_id_foreign` FOREIGN KEY(`borrower_id`) REFERENCES `borrowers`(`id`);
ALTER TABLE
    `borrowed_books` ADD CONSTRAINT `borrowed_books_book_id_foreign` FOREIGN KEY(`book_id`) REFERENCES `books`(`id`);