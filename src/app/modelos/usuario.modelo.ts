export interface UsuarioDto {
  id: number;
  nombreCompleto: string;
  iniciales: string;
  correo: string;
  roles: string[];
}

export interface UsuarioCrearDto {
  nombreCompleto: string;
  iniciales: string;
  correo: string;
  clave: string;
  roles: string[];
}