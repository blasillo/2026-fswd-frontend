import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Keycloak from 'keycloak-js';

import { TareaDto } from '../../modelos/tarea.modelo';
import { TareaService } from '../../servicios/tarea.servicio';

const COLORES_PERMITIDOS = ['Azul', 'Verde', 'Amarillo', 'Morado', 'Naranja', 'Rojo', 'Gris'];

@Component({
  selector: 'app-tareas-listado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './tareas-listado.component.html',
  styleUrl: './tareas-listado.component.css'
})
export class TareasListadoComponent {
  private readonly tareaServicio = inject(TareaService);
  private readonly keycloak = inject(Keycloak);
  private readonly snackBar = inject(MatSnackBar);

  guardando = signal(false);

  readonly colores = COLORES_PERMITIDOS;
  readonly columnas = ['nombre', 'estado', 'color', 'acciones'];

  tareas = signal<TareaDto[]>([]);
  paginaActual = signal(0);
  totalPaginas = signal(0);
  tamanioPagina = 5;

  mostrarFormulario = signal(false);
  tareaEnEdicion = signal<TareaDto | null>(null);

  formulario: TareaDto = this.formularioVacio();

  constructor() {
    this.cargarTareas();
  }

  private correoUsuario(): string {
    return this.keycloak.tokenParsed?.['email'] ?? '';
  }

  private formularioVacio(): TareaDto {
    return { id: null, nombre: '', estado: 0, color: 'Azul', usuarioCorreo: this.correoUsuario() };
  }

  cargarTareas(): void {
    this.tareaServicio.obtenerTareas(this.correoUsuario(), this.paginaActual(), this.tamanioPagina)
      .subscribe(respuesta => {
        this.tareas.set(respuesta.content);
        this.totalPaginas.set(respuesta.page.totalPages);
      });
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 0) {
      this.paginaActual.set(this.paginaActual() - 1);
      this.cargarTareas();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual() + 1 < this.totalPaginas()) {
      this.paginaActual.set(this.paginaActual() + 1);
      this.cargarTareas();
    }
  }

  abrirFormularioNuevo(): void {
    this.tareaEnEdicion.set(null);
    this.formulario = this.formularioVacio();
    this.mostrarFormulario.set(true);
  }

  abrirFormularioEdicion(tarea: TareaDto): void {
    this.tareaEnEdicion.set(tarea);
    this.formulario = { ...tarea };
    this.mostrarFormulario.set(true);
  }

  cancelarFormulario(): void {
    this.mostrarFormulario.set(false);
  }

  guardar(): void {
    const esEdicion = this.tareaEnEdicion() !== null;
    const observable = esEdicion
      ? this.tareaServicio.modificarTarea(this.formulario)
      : this.tareaServicio.crearTarea(this.formulario);

    this.guardando.set(true);
    observable.subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarFormulario.set(false);
        this.cargarTareas();
      },
      error: (error) => {
        this.guardando.set(false);
        const mensaje = error?.error?.message ?? 'No se ha podido guardar la tarea. Revisa los datos.';
        this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
      }
    });
  }

  borrar(tarea: TareaDto): void {
    if (tarea.id === null) {
      return;
    }
    this.tareaServicio.borrarTarea(tarea.id).subscribe({
      next: () => this.cargarTareas(),
      error: (error) => {
        const mensaje = error?.error?.message ?? 'No se ha podido borrar la tarea.';
        this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
      }
    });
  }
}