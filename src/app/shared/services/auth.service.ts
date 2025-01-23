import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLoggedIn = false;
  getUserLoggedIn() {
    return this.userLoggedIn;
  }
  login() {
    this.userLoggedIn = true;
    return of(true);
  }
  logout() {
    localStorage.clear();
  }
}
