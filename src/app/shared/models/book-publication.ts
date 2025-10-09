export interface BookPublication {
  id: number;
  bookId: number;
  publisherName: string;
  city?: string;
  edition?: string;
  pages?: number;
}
