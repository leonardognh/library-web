import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-blank',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class BlankComponent {}
