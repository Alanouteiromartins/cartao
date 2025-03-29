import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavegacaoComponent } from "./components/navegacao/navegacao.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavegacaoComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  router: Router = new Router();

  paginaLogin(): boolean {
    return this.router.url === '/login';
  }

  title = 'cartao';
}
