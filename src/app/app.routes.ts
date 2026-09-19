import { Routes } from '@angular/router';
import { TareasListadoComponent } from './paginas/tareas/tareas-listado.component';
 
export const routes: Routes = [
  { path: 'tareas', component: TareasListadoComponent },
  { path: '', redirectTo: 'tareas', pathMatch: 'full' }
];
 