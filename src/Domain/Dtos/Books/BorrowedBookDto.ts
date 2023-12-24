export type BorrowedBookDto = {
    book_id: number;
    borrowed_book_id: number;
    book_title: string;
    borrow_date: string;
    due_date: string;
    borrower_id: number;
    borrower_email: string;
}