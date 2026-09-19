import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDto, UsuarioCrearDto } from '../modelos/usuario.modelo';

const URL_BASE = 'http://localhost:8080/api/v1.0/usuarios';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);

  obtenerUsuarios(): Observable<UsuarioDto[]> {
    return this.http.get<UsuarioDto[]>(URL_BASE);
  }

  crearUsuario(usuario: UsuarioCrearDto): Observable<UsuarioDto> {
    return this.http.post<UsuarioDto>(URL_BASE, usuario);
  }

  modificarUsuario(usuario: UsuarioDto): Observable<UsuarioDto> {
    return this.http.put<UsuarioDto>(URL_BASE, usuario);
  }

  borrarUsuario(usuarioId: number): Observable<number> {
    const params = new HttpParams().set('usuarioId', usuarioId);
    return this.http.delete<number>(URL_BASE, { params });
  }
}