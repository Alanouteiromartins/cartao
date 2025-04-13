import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navegacao',
  standalone: true,
  imports: [RouterLink,CommonModule, RouterLinkActive],
  templateUrl: './navegacao.component.html',
  styleUrl: './navegacao.component.css'
})
export class NavegacaoComponent {

  fecharMenu(): void {
    // Encontra o elemento de toggler e o colapsa se estiver expandido
    const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement;
    const navbarCollapse = document.querySelector('.navbar-collapse') as HTMLElement;
    
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarToggler?.click();
    }
  }
}
