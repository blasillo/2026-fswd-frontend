import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import Keycloak from 'keycloak-js';

@Component({
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly keycloak = inject(Keycloak);
  private readonly ROLES_TECNICOS = ['offline_access', 'uma_authorization', 'default-roles-tareas-app'];

  get estaAutenticado(): boolean {
    return this.keycloak.authenticated ?? false;
  }

  get nombreUsuario(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }

  get correoUsuario(): string | undefined {
    return this.keycloak.tokenParsed?.['email'];
  }

  get rolesUsuario(): string[] {
    const roles: string[] = this.keycloak.tokenParsed?.['realm_access']?.['roles'] ?? [];
    return roles.filter((rol) => !this.ROLES_TECNICOS.includes(rol));
  }

  iniciarSesion(): void {
    this.keycloak.login();
  }

  cerrarSesion(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }
}