import { Routes } from '@angular/router';
import { PessoaComponent } from './components/pessoa/pessoa.component';
import { ComprasComponent } from './components/compras/compras.component';

export const routes: Routes = [
    {path: 'pessoas', component: PessoaComponent},
    {path: 'compras',  component: ComprasComponent}
];
