import { Routes } from '@angular/router';
import { RechercheRefComponent } from './recherche-ref/recherche-ref.component';

export const routes: Routes = [
  {
    path: '', // Route par défaut
    component: RechercheRefComponent,
  },
  {
    path: '**', // Redirection des routes inconnues vers la route par défaut
    redirectTo: '',
    pathMatch: 'full',
  },
];
