import { Routes } from '@angular/router';
import { PessoaComponent } from './components/pessoa/pessoa.component';
import { ComprasComponent } from './components/compras/compras.component';
import { RelatorioComponent } from './components/relatorio/relatorio.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './auth.guard';
import { RegistroComponent } from './components/registro/registro.component';
import { ContaComponent } from './components/conta/conta.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'pessoas', component: PessoaComponent, canActivate: [authGuard]},
    {path: 'compras',  component: ComprasComponent, canActivate: [authGuard]},
    {path: 'relatorios', component: RelatorioComponent, canActivate: [authGuard]},
    {path: 'conta', component: ContaComponent, canActivate: [authGuard]},
    {path: '**', redirectTo: 'login'}
];
