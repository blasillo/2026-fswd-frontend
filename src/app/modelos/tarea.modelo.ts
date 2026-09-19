export interface TareaDto {
  id: number | null;
  nombre: string;
  estado: number;
  color: string;
  usuarioCorreo: string;
}

export interface PaginaInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginaDto<T> {
  content: T[];
  page: PaginaInfo;
}