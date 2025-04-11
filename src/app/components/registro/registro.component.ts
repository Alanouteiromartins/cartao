import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertaService } from '../../services/alerta.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  constructor(private router: Router, private alertaService: AlertaService, private usuarioService: UsuarioService){}

  nome: string = '';
  email: string = '';
  senha: string = '';

  voltar(){
    this.router.navigate(['login']);
  }

  addUsuario(){
    if(this.nome === '' || this.email === '' || this.senha === '' ){
      this.alertaService.erro('Por favor preenche todos os campos');
      return;
    }

    const novoUsuario = {
      nome: this.nome,
      email: this.email,
      senha: this.senha
    }

    this.usuarioService.addUsuario(novoUsuario).subscribe(async ()=>{
      await this.alertaService.sucesso('Usuário adicionado com sucesso');

      const confirmacao = this.alertaService.confirmar('Deseja retornar a tela de login?', '');

      if(await confirmacao){
        this.router.navigate(['login']);
      }
    })
    
  }

}
