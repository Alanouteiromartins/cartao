import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavegacaoComponent } from "./components/navegacao/navegacao.component";
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavegacaoComponent, NgIf, CommonModule],
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
