import { Author } from './author';
import { Book } from './book';

export interface BookAuthor {
  id: number;
  bookId: number;
  authorId: number;
  author?: Author;
  book?: Book;
}
