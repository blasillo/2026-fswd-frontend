import { Routes } from '@angular/router';
import { TareasListadoComponent } from './paginas/tareas/tareas-listado.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { UsuariosListadoComponent } from './paginas/usuarios/usuarios-listado.component';

import { authGuard } from './guardias/auth.guardia';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'tareas', component: TareasListadoComponent, canActivate: [authGuard] },
  { path: 'usuarios', component: UsuariosListadoComponent, canActivate: [authGuard] }
];
 