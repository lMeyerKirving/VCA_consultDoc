import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const sessionID = this.getSessionIDFromUrl();

    if (!sessionID) {
      window.location.href = 'https://dms-server/apps/aud-portal-app/'; //TODO : redirection dynamique (dms-server)
      return false;
    }

    return true;
  }

  // Fonction pour extraire le sessionID de l'URL
  private getSessionIDFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('AUSessionID');
  }
}
