import { CanActivateFn, Router } from '@angular/router';
import { inject, Inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const usuarioLogado = sessionStorage.getItem('usuario');

  if(usuarioLogado){
    return true;
  }else{
    router.navigate(['login']);
    return false;
  }
};
