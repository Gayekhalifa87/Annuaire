
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Assurez-vous que ce fichier existe et contient vos routes

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Fournit HttpClient pour toute l'application
    provideRouter(routes) // Fournit les routes pour l'application
  ]
}).catch(err => console.error(err));
