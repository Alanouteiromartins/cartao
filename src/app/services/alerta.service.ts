import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  constructor() {}

  sucesso(mensagem: string, titulo: string = 'Sucesso!'): Promise<void> {
    return Swal.fire({
      title: titulo,
      text: mensagem,
      icon: 'success',
      confirmButtonText: 'OK'
    }).then();
  }

  erro(mensagem: string, titulo: string = 'Erro!') {
    Swal.fire({
      title: titulo,
      text: mensagem,
      icon: 'error',
      confirmButtonText: 'Fechar'
    });
  }

  info(mensagem: string, titulo: string = 'Informação') {
    Swal.fire({
      title: titulo,
      text: mensagem,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }

  confirmar(mensagem: string, titulo: string = 'Tem certeza?'): Promise<boolean> {
    return Swal.fire({
      title: titulo,
      text: mensagem,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then((result) => result.isConfirmed);
  }
}
