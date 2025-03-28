import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavegacaoComponent } from "./components/navegacao/navegacao.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavegacaoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cartao';
}
