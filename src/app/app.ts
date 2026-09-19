import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import Keycloak from 'keycloak-js';

@Component({
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly keycloak = inject(Keycloak);

  get estaAutenticado(): boolean {
    return this.keycloak.authenticated ?? false;
  }

  get nombreUsuario(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }

  iniciarSesion(): void {
    this.keycloak.login();
  }

  cerrarSesion(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }
}