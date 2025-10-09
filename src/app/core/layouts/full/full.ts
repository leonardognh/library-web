import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '../../ui/toolbar/toolbar';

@Component({
  standalone: true,
  selector: 'app-full',
  imports: [ToolbarComponent, RouterOutlet],
  template: ` <div class="wrapper">
    <app-toolbar />

    <div class="container-fluid">
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  </div>`,
})
export class FullComponent {}
