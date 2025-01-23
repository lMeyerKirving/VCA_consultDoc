import { Component } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

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

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.initLogin();
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

        // Affectation des résultats reçus
        this.result = {
          ref_utilisat: response.data?.map((item: any) => item.ref_utilisat), // On récupère toutes les ref_utilisat
          // Les catégories et fichiers sont conservés en commentaire pour réutilisation plus tard
          // categories: response.categories,
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

