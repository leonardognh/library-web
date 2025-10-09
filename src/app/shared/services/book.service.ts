import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Author } from '../models/author';
import { Book } from '../models/book';
import { BookAuthor } from '../models/book-author';
import { BookCategory } from '../models/book-category';
import { BookPublication } from '../models/book-publication';
import { Category } from '../models/category';
import { Page } from '../models/page';

@Injectable({ providedIn: 'root' })
export class BookService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  listPaged(params: {
    q?: string;
    _page?: number;
    _limit?: number;
    _sort?: string;
    _order?: 'asc' | 'desc';
  }): Observable<Page<Book>> {
    let p = new HttpParams()
      .set('_page', String(params._page ?? 1))
      .set('_limit', String(params._limit ?? 10));
    if (params.q) p = p.set('q', params.q);
    if (params._sort) p = p.set('_sort', params._sort);
    if (params._order) p = p.set('_order', params._order);
    return this.http
      .get<Book[]>(`${this.base}/books`, { params: p, observe: 'response' })
      .pipe(
        map((resp: HttpResponse<Book[]>) => ({
          items: resp.body ?? [],
          total: Number(resp.headers.get('X-Total-Count') ?? '0') || 0,
        }))
      );
  }

  get(id: number) {
    return this.http.get<Book>(`${this.base}/books/${id}`);
  }
  create(payload: Omit<Book, 'id'>) {
    return this.http.post<Book>(`${this.base}/books`, payload);
  }
  update(id: number, patch: Partial<Book>) {
    return this.http.patch<Book>(`${this.base}/books/${id}`, patch);
  }
  delete(id: number) {
    return this.http.delete<void>(`${this.base}/books/${id}`);
  }

  authors() {
    return this.http.get<Author[]>(`${this.base}/authors`);
  }
  categories() {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }

  authorsOf(bookId: number) {
    return this.http.get<BookAuthor[]>(`${this.base}/books/${bookId}/authors`);
  }
  categoriesOf(bookId: number) {
    return this.http.get<BookCategory[]>(
      `${this.base}/books/${bookId}/categories`
    );
  }
  publicationOf(bookId: number) {
    return this.http
      .get<BookPublication[]>(`${this.base}/books/${bookId}/publication`)
      .pipe(map((arr) => arr[0] ?? null));
  }
  getDetail(bookId: number) {
    return forkJoin({
      book: this.get(bookId),
      authors: this.authorsOf(bookId).pipe(map((x) => x.map((i) => i.author!))),
      categories: this.categoriesOf(bookId).pipe(
        map((x) => x.map((i) => i.category!))
      ),
      publication: this.publicationOf(bookId),
    });
  }

  linkAuthor(bookId: number, authorId: number) {
    return this.http.post<BookAuthor>(`${this.base}/book_authors`, {
      bookId,
      authorId,
    });
  }
  unlinkAuthor(linkId: number) {
    return this.http.delete<void>(`${this.base}/book_authors/${linkId}`);
  }
  linkCategory(bookId: number, categoryId: number) {
    return this.http.post<BookCategory>(`${this.base}/book_categories`, {
      bookId,
      categoryId,
    });
  }
  unlinkCategory(linkId: number) {
    return this.http.delete<void>(`${this.base}/book_categories/${linkId}`);
  }
  findAuthorLink(bookId: number, authorId: number) {
    return this.http
      .get<BookAuthor[]>(`${this.base}/book_authors`, {
        params: { bookId, authorId } as any,
      })
      .pipe(map((list) => list[0]?.id ?? null));
  }
  findCategoryLink(bookId: number, categoryId: number) {
    return this.http
      .get<BookCategory[]>(`${this.base}/book_categories`, {
        params: { bookId, categoryId } as any,
      })
      .pipe(map((list) => list[0]?.id ?? null));
  }

  upsertPublication(
    bookId: number,
    data: Omit<BookPublication, 'id' | 'bookId'>
  ) {
    return this.http
      .get<BookPublication[]>(`${this.base}/book_publications`, {
        params: { bookId } as any,
      })
      .pipe(
        switchMap((list) =>
          list.length
            ? this.http.patch<BookPublication>(
                `${this.base}/book_publications/${list[0].id}`,
                data
              )
            : this.http.post<BookPublication>(
                `${this.base}/book_publications`,
                { ...data, bookId }
              )
        )
      );
  }

  createFull(input: {
    book: Omit<Book, 'id'>;
    authorIds?: number[];
    categoryIds?: number[];
    publication?: Omit<BookPublication, 'id' | 'bookId'>;
  }) {
    return this.create(input.book).pipe(
      switchMap((created) => {
        const ops: Observable<unknown>[] = [];
        if (input.authorIds?.length)
          ops.push(
            forkJoin(input.authorIds.map((a) => this.linkAuthor(created.id, a)))
          );
        if (input.categoryIds?.length)
          ops.push(
            forkJoin(
              input.categoryIds.map((c) => this.linkCategory(created.id, c))
            )
          );
        if (input.publication)
          ops.push(this.upsertPublication(created.id, input.publication));
        return (ops.length ? forkJoin(ops) : forkJoin([])).pipe(
          map(() => created)
        );
      })
    );
  }

  updateFull(
    id: number,
    input: {
      patch: Partial<Book>;
      authorIds?: number[];
      categoryIds?: number[];
      publication?: Omit<BookPublication, 'id' | 'bookId'> | null;
    }
  ) {
    return this.update(id, input.patch).pipe(
      switchMap((updated) =>
        forkJoin({
          existingAuthorLinks: this.authorsOf(id),
          existingCategoryLinks: this.categoriesOf(id),
        }).pipe(
          switchMap(({ existingAuthorLinks, existingCategoryLinks }) => {
            const toKeepAuthors = new Set(input.authorIds ?? []);
            const toKeepCategories = new Set(input.categoryIds ?? []);

            const delAuthorOps = existingAuthorLinks
              .filter((l) => !toKeepAuthors.has(l.authorId))
              .map((l) => this.unlinkAuthor(l.id));

            const delCategoryOps = existingCategoryLinks
              .filter((l) => !toKeepCategories.has(l.categoryId))
              .map((l) => this.unlinkCategory(l.id));

            const addAuthorOps = (input.authorIds ?? [])
              .filter((a) => !existingAuthorLinks.some((l) => l.authorId === a))
              .map((a) => this.linkAuthor(id, a));

            const addCategoryOps = (input.categoryIds ?? [])
              .filter(
                (c) => !existingCategoryLinks.some((l) => l.categoryId === c)
              )
              .map((c) => this.linkCategory(id, c));

            const pubOp =
              input.publication === null
                ? this.publicationOf(id).pipe(
                    switchMap((pub) =>
                      pub
                        ? this.http.delete<void>(
                            `${this.base}/book_publications/${pub.id}`
                          )
                        : (forkJoin([]) as any)
                    )
                  )
                : input.publication
                ? this.upsertPublication(id, input.publication)
                : (forkJoin([]) as any);

            const ops: Observable<unknown>[] = [
              ...delAuthorOps,
              ...delCategoryOps,
              ...addAuthorOps,
              ...addCategoryOps,
              pubOp,
            ];

            return (ops.length ? forkJoin(ops) : forkJoin([])).pipe(
              map(() => updated)
            );
          })
        )
      )
    );
  }
}
