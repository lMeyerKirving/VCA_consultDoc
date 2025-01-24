import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Vérifier si le paramètre sessionID est présent dans l'URL
    const sessionID = this.getSessionIDFromUrl();

    if (!sessionID) {
      // Si aucun sessionID, rediriger vers l'URL externe
      window.location.href = 'https://dms-server/apps/aud-portal-app/';
      return false; // Bloque l'accès à la route actuelle
    }

    return true; // Autorise l'accès si le sessionID est présent
  }

  // Fonction pour extraire le sessionID de l'URL
  private getSessionIDFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search); // Récupère les paramètres de l'URL
    return params.get('AUSessionID'); // Renvoie la valeur du paramètre "AUSessionID"
  }
}
