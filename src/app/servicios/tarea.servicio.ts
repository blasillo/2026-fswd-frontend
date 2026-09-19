import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TareaDto, PaginaDto } from '../modelos/tarea.modelo';

const URL_BASE = 'http://localhost:8080/api/v1.0/tareas';

@Injectable({ providedIn: 'root' })
export class TareaService {
  private readonly http = inject(HttpClient);

  obtenerTareas(correo: string, pagina: number, tamanio: number): Observable<PaginaDto<TareaDto>> {
    const params = new HttpParams()
      .set('correo', correo)
      .set('page', pagina)
      .set('size', tamanio);

    return this.http.get<PaginaDto<TareaDto>>(URL_BASE, { params });
  }

  crearTarea(tarea: TareaDto): Observable<TareaDto> {
    return this.http.post<TareaDto>(URL_BASE, tarea);
  }

  modificarTarea(tarea: TareaDto): Observable<TareaDto> {
    return this.http.put<TareaDto>(URL_BASE, tarea);
  }

  borrarTarea(tareaId: number): Observable<number> {
    const params = new HttpParams().set('tareaId', tareaId);
    return this.http.delete<number>(URL_BASE, { params });
  }
}