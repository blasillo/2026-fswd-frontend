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
import { MatChipsModule } from '@angular/material/chips';

import { UsuarioDto, UsuarioCrearDto } from '../../modelos/usuario.modelo';
import { UsuarioService } from '../../servicios/usuario.servicio';

const ROLES_DISPONIBLES = ['ADMINISTRADOR', 'BASE'];

@Component({
  selector: 'app-usuarios-listado',
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
    MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './usuarios-listado.component.html',
  styleUrl: './usuarios-listado.component.css'
})
export class UsuariosListadoComponent {
  private readonly usuarioServicio = inject(UsuarioService);
  private readonly snackBar = inject(MatSnackBar);

  readonly roles = ROLES_DISPONIBLES;
  readonly columnas = ['nombreCompleto', 'iniciales', 'correo', 'roles', 'acciones'];

  usuarios = signal<UsuarioDto[]>([]);

  mostrarFormulario = signal(false);
  usuarioEnEdicion = signal<UsuarioDto | null>(null);
  guardando = signal(false);

  formulario: UsuarioCrearDto & { id?: number } = this.formularioVacio();

  constructor() {
    this.cargarUsuarios();
  }

  private formularioVacio(): UsuarioCrearDto & { id?: number } {
    return { nombreCompleto: '', iniciales: '', correo: '', clave: '', roles: [] };
  }

  cargarUsuarios(): void {
    this.usuarioServicio.obtenerUsuarios().subscribe({
      next: usuarios => this.usuarios.set(usuarios),
      error: (error) => {
        const mensaje = error?.error?.message ?? 'No se han podido cargar los usuarios.';
        this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
      }
    });
  }

  abrirFormularioNuevo(): void {
    this.usuarioEnEdicion.set(null);
    this.formulario = this.formularioVacio();
    this.mostrarFormulario.set(true);
  }

  abrirFormularioEdicion(usuario: UsuarioDto): void {
    this.usuarioEnEdicion.set(usuario);
    this.formulario = { ...usuario, clave: '' };
    this.mostrarFormulario.set(true);
  }

  cancelarFormulario(): void {
    this.mostrarFormulario.set(false);
  }

  guardar(): void {
    const enEdicion = this.usuarioEnEdicion();
    this.guardando.set(true);

    const observable = enEdicion
      ? this.usuarioServicio.modificarUsuario({
          id: enEdicion.id,
          nombreCompleto: this.formulario.nombreCompleto,
          iniciales: this.formulario.iniciales,
          correo: this.formulario.correo,
          roles: this.formulario.roles
        })
      : this.usuarioServicio.crearUsuario(this.formulario);

    observable.subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarFormulario.set(false);
        this.cargarUsuarios();
      },
      error: (error) => {
        this.guardando.set(false);
        const mensaje = error?.error?.message ?? 'No se ha podido guardar el usuario. Revisa los datos.';
        this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
      }
    });
  }

  borrar(usuario: UsuarioDto): void {
    this.usuarioServicio.borrarUsuario(usuario.id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (error) => {
        const mensaje = error?.error?.message ?? 'No se ha podido borrar el usuario.';
        this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
      }
    });
  }
}