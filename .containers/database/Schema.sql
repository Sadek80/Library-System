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


INSERT INTO `books`
(`title`, `author`, `isbn`, `available_quantity`, `shelf_location`)
VALUES('1984', 'George Orwel', '1234567891234', 10, 'left most');

INSERT INTO `books`
(`title`, `author`, `isbn`, `available_quantity`, `shelf_location`)
VALUES('Database', 'Hussien', '8888888888888', 10, 'left most');


-- borrow book sp --

DELIMITER //

CREATE PROCEDURE BorrowBook (
    IN book_id BIGINT,
    IN borrower_id BIGINT,
    IN borrow_date DATE,
    IN due_date DATE
)
BEGIN
    DECLARE quantityAvailable INT;

    START TRANSACTION;

    SELECT available_quantity INTO quantityAvailable FROM books WHERE id = book_id FOR UPDATE;

    IF quantityAvailable > 0 THEN

        INSERT INTO borrowed_books (book_id, borrower_id, borrow_date, due_date)
        VALUES (book_id, borrower_id, borrow_date, due_date);

        UPDATE books SET available_quantity = quantityAvailable - 1 WHERE id = book_id;

        COMMIT;
        
        SELECT 1 AS succeeded;
    ELSE
        ROLLBACK;

        SELECT 0 AS succeeded;
    END IF;
END //

DELIMITER ;


-- Return Book Sp --
DELIMITER //

CREATE PROCEDURE ReturnBook(
    IN book_id BIGINT,
    IN borrowed_book_id BIGINT,
    IN return_date DATE
)
BEGIN
    DECLARE bookCount INT;
    
    SELECT COUNT(*)
    INTO bookCount
    FROM borrowed_books
    WHERE book_id = book_id AND is_returned = FALSE AND id = borrowed_book_id;

    IF bookCount > 0 THEN
        START TRANSACTION;
        
        UPDATE borrowed_books
        SET is_returned = TRUE, return_date = return_date
        WHERE book_id = book_id AND is_returned = FALSE AND id = borrowed_book_id;

        UPDATE books
        SET available_quantity = available_quantity + 1
        WHERE book_id = book_id;

        COMMIT;
        
        SELECT 1 AS succeeded;
    ELSE
        SELECT 0 AS succeeded;
    END IF;
END //

DELIMITER ;


