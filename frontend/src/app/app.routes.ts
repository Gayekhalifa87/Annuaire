import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { SearchComponent } from './search/search.component';
import { ConnexionComponent } from './connexion/connexion.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'accueil',
        pathMatch: 'full',
    },
   {
    path : 'accueil',
    component: AccueilComponent
    },
    {
        path: 'recherche',
        component: SearchComponent
    },
    {
        path: 'connexion',
        component: ConnexionComponent
    }
  
];
