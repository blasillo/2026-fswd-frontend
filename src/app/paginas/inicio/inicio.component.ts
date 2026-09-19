import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  private readonly keycloak = inject(Keycloak);

  get estaAutenticado(): boolean {
    return this.keycloak.authenticated ?? false;
  }

  iniciarSesion(): void {
    this.keycloak.login();
  }
}