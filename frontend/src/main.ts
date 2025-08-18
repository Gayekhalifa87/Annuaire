import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // active les interceptors
    AuthInterceptor,                             // injecte ton interceptor
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
