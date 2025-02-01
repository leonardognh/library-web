import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  menus = [
    {
      label: 'Loja',
      route: '/shop',
    },
    {
      label: 'Cadastros',
      children: [
        {
          label: 'Autores',
          route: '/author',
        },
        {
          label: 'Categoria',
          route: '/category',
        },
        {
          label: 'Livros',
          route: '/book',
        },
      ],
    },
  ];
}
