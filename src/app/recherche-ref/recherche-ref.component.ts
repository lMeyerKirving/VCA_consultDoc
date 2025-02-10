import { Component } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recherche-ref',
  standalone: true,
  templateUrl: './recherche-ref.component.html',
  styleUrls: ['./recherche-ref.component.css'],
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ]
})
export class RechercheRefComponent {
  searchTerm: string = ''; // Contient la référence utilisateur saisie
  result: any = null; // Résultat obtenu après recherche
  noResults: boolean = false; // Indique si aucun résultat n'a été trouvé
  sessionID: string | null = null;
  baseURL: string | null = null;
  serv: string | null = null;

  selectedFunction: string = '';

  constructor(private backendService: BackendService, private route: ActivatedRoute, private router: Router) {}

  levels: any[] = []; // Liste des Levels
  users: any[] = []; // Liste des Users
  filteredUsers: any[] = []; // Liste des Users filtrés selon le Level sélectionné
  functions: any[] = [];

  selectedLevel: string = ''; // Niveau sélectionné
  selectedUser: string = ''; // Utilisateur sélectionné

  ngOnInit(): void {
    const currentUrl = window.location.href;
    const urlObject = new URL(currentUrl);

    this.baseURL = `${urlObject.origin}/`;
    this.serv = `${urlObject.origin}`;
    this.backendService.audrosServer = this.baseURL;
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

    this.loadLevels();
    this.loadUsers();
    this.loadFunctions();
  }

  onSearch(): void {
    // Récupérer les num_art pour chaque champ sélectionné ou définir "0" par défaut
    const selectedLevelNumArt = this.levels.find(level => level.ref_utilisat === this.selectedLevel)?.num_art || '0';
    const selectedUserNumArt = this.users.find(user => user.ref_utilisat === this.selectedUser)?.num_art || '0';
    const selectedFunctionNumArt = this.functions.find(func => func.role === this.selectedFunction)?.num_art || '0';

    // Construire la chaîne avec les champs et leurs num_art ou "0"
    const searchParameters = [
      `VCA:${this.searchTerm || ''}`,    // Référence VCA
      `PIL:${selectedLevelNumArt}`,      // Pilier (num_art ou "0")
      `COL:${selectedUserNumArt}`,       // Collection (num_art ou "0")
      `FCT:${selectedFunctionNumArt}`    // Fonction (num_art ou "0")
    ].join(';'); // Concaténer avec ';' comme séparateur

    console.log('Paramètres de recherche :', searchParameters);

    // Appel au backend
    this.backendService.getObjectByRef(searchParameters, this.serv).subscribe({
      next: (response) => {
        console.log('Réponse du backend :', response);

        const documents = response.data
          ?.flatMap((item: any) => item.documents) || [];
        this.noResults = documents.length === 0;

        if (!this.noResults) {
          this.result = {
            ref_utilisat: documents.map((doc: any) => ({
              ref_utilisat: doc.ref_utilisat,
              designation: doc.designation,
              urlPicture: doc.urlPicture,
              url: doc.url,
            })),
          };
        } else {
          this.result = null; // Réinitialiser les résultats si aucun document
        }

        console.log('Résultat formaté :', this.result);
      },
      error: (err) => {
        console.error('Erreur lors de la recherche :', err);
        //alert('Une erreur est survenue lors de la recherche.');
      },
    });
  }



  loadLevels(): void {
    this.backendService.getLevell().subscribe({
      next: (response) => {
        console.log('Levels reçus : ', response);
        this.levels = response.data?.map((level: { ref_utilisat: string; num_art: string }) => ({
          ...level,
          ref_utilisat: level.ref_utilisat, // Normalisation en minuscules
          num_art: level.num_art // Ajout de num_art
        })) || [];
      },
      error: (err) => console.error('Erreur lors du chargement des Levels :', err)
    });
  }

  loadUsers(): void {
    this.backendService.getUsers().subscribe({
      next: (response) => {
        console.log('Users reçus : ', response);
        this.users = response.data?.map((user: { niveau: string; num_art: string }) => ({
          ...user,
          niveau: user.niveau, // Normalisation en minuscules
          num_art: user.num_art // Ajout de num_art
        })) || [];
      },
      error: (err) => console.error('Erreur lors du chargement des Users :', err)
    });
  }

  loadFunctions(): void {
    this.backendService.getFonction().subscribe({
      next: (response) => {
        console.log('Fonctions reçues :', response);
        this.functions = response.data?.map((func: { role: string; num_art: string }) => ({
          ...func,
          role: func.role, // Conserver le rôle
          num_art: func.num_art // Ajout de num_art
        })) || [];
      },
      error: (err) => console.error('Erreur lors du chargement des fonctions :', err),
    });
  }




  onLevelChange(): void {
    console.log('Niveau sélectionné : ', this.selectedLevel);

    if (this.selectedLevel) {
      this.filteredUsers = this.users.filter(user =>
        user.niveau === this.selectedLevel
      );
      this.selectedUser = '0';
    } else {
      this.filteredUsers = [];
      this.selectedUser = '0';
    }
  }


}
