import type { CanActivateFn } from '@angular/router';
import { createAuthGuard, type AuthGuardData } from 'keycloak-angular';
 
const comprobarAcceso = async (route: any, state: any, authData: AuthGuardData): Promise<boolean> => {
  const { authenticated, keycloak } = authData;
 
  if (!authenticated) {
    await keycloak.login({ redirectUri: window.location.origin + state.url });
    return false;
  }
 
  return true;
};
 
export const authGuard = createAuthGuard<CanActivateFn>(comprobarAcceso);