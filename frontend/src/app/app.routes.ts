import { Routes } from '@angular/router';
import { ParametresComponent } from './pages/parametres/parametres.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/accueil',
    pathMatch: 'full'
  },
  {
    path: 'accueil', 
    loadComponent: () => import('./pages/collaborateur/accueil/accueil.component').then(m => m.AccueilComponent)
  },
  {
    path: 'connexion',
    loadComponent: () => import('./pages/admin/connexion/connexion.component').then(m => m.ConnexionComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'recherche',
    loadComponent: () => import('./components/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'parametres',
    component: ParametresComponent
  },
  {
    path: '**',
    redirectTo: '/accueil'
  }
];
