import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  menus = [
    {
      label: 'Autores',
      route: '/author',
    },
    {
      label: 'Livros',
      route: '/book',
    },
    {
      label: 'Cadastros',
      children: [
        {
          label: 'Categoria',
          route: '/category',
        },
        {
          label: 'Cliente',
          route: '/customer',
        },
      ],
    },
  ];
}
