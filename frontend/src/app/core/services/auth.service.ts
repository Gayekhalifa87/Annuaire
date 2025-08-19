// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'auth_token'; // clé pour localStorage

  constructor(private http: HttpClient) {}

  // Connexion
  login(email: string, password: string) {
  return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
    .pipe(
      tap(res => {
        if (res.token) localStorage.setItem('auth_token', res.token);
      })
    );
}


  // Déconnexion
  logout(): Observable<any> {
    // Plus besoin de passer manuellement le token, l'interceptor s'en charge
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  // Récupérer le token actuel
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Vérifier si connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Supprimer le token localement après déconnexion
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
