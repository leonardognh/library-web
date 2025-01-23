import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    senha: new FormControl('', Validators.required),
  });
  login() {
    this.authService.login().subscribe(() => {
      this.router.navigate(['/hw']);
    });
  }
}
