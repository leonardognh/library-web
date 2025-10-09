import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

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
      <span class="ms-auto"></span>
      <ng-container>
        <span class="me-3 small">Olá, {{ auth.user()?.name }}</span>

        <button matIconButton aria-label="Sair" (click)="logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </ng-container>
    </mat-toolbar>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="goTo('books')">Livros</button>
      <button mat-menu-item (click)="goTo('categories')">Categorias</button>
      <button mat-menu-item (click)="goTo('authors')">Autores</button>
    </mat-menu>`,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
})
export class ToolbarComponent {
  private router = inject(Router);
  auth = inject(AuthService);
  goTo(route: string) {
    this.router.navigate([route]);
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
