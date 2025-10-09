import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  template: `<mat-toolbar>
      <button
        matIconButton
        aria-label="Example icon-button with menu icon"
        [matMenuTriggerFor]="menu"
      >
        <mat-icon>menu</mat-icon>
      </button>
      <span>Biblioteca</span>
      <span class="example-spacer"></span>
    </mat-toolbar>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="goTo('books')">Livros</button>
      <button mat-menu-item (click)="goTo('categories')">Categorias</button>
      <button mat-menu-item (click)="goTo('authors')">Autores</button>
    </mat-menu>`,
  styles: [
    `
      .example-spacer {
        flex: 1 1 auto;
      }
    `,
  ],
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
})
export class ToolbarComponent {
  private router = inject(Router);
  goTo(route: string) {
    this.router.navigate([route]);
  }
}
