import { Component } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-recherche-ref',
  standalone: true, // Rend le composant standalone
  templateUrl: './recherche-ref.component.html',
  styleUrls: ['./recherche-ref.component.css'],
  imports: [
    FormsModule, // Nécessaire pour [(ngModel)]
    NgIf,
    NgForOf
  ]
})
export class RechercheRefComponent {
  searchTerm: string = ''; // Contient la référence utilisateur saisie
  result: any = null; // Résultat obtenu après recherche
  sessionID: string | null = null;

  constructor(private backendService: BackendService, private route: ActivatedRoute, private router: Router ) {}

  ngOnInit(): void {
    const currentUrl = window.location.href;
    const urlObject = new URL(currentUrl);

    // Extraction de l'origine (protocole + nom de domaine)
    const baseUrl = `${urlObject.origin}/`;
    this.backendService.audrosServer = baseUrl;
    this.route.queryParamMap.subscribe((params) => {
      this.sessionID = params.get('AUSessionID');
      console.log('SessionID :', this.sessionID);

      if (this.sessionID) {
        this.backendService.log(this.sessionID).subscribe({
          next: (response) => console.log('Connexion réussie :', response),
          error: (err) => console.error('Erreur de connexion :', err),
        });
      }
    });
  }

  // Initialisation de l'utilisateur
  private initLogin() {
    this.backendService.autologin().subscribe({
      next: (data) => {
        if (data) {
          console.log('Connexion réussie : ', data);
        }
      },
      error: (error) => {
        console.error('Erreur lors de l\'autologin :', error);
      }
    });
  }

  // Méthode de recherche appelée lors de la soumission du formulaire
  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      alert('Veuillez entrer une référence valide.');
      return;
    }

    this.backendService.getObjectByRef(this.searchTerm).subscribe({
      next: (response) => {
        console.log('Réponse du backend : ', response);

        // Formatage des résultats
        this.result = {
          ref_utilisat: response.data
            ?.flatMap((item: any) => item.documents) // Fusionne tous les tableaux de documents
            .map((doc: any) => ({
              ref_utilisat: doc.ref_utilisat,
              designation: doc.designation,
            })),
        };

        console.log('Résultat formaté : ', this.result);
      },
      error: (err) => {
        console.error('Erreur lors de la recherche :', err);
        alert('Une erreur est survenue lors de la recherche.');
      },
    });
  }

}

