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
  private userIdKey = 'userId';    // pour stocker l'ID utilisateur si besoin

  constructor(private http: HttpClient) {}

  // Connexion
  login(email: string, password: string) {
    return this.http.post<{ token: string, userId?: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          if (res.token) {
            localStorage.setItem(this.tokenKey, res.token);
          }
          if (res.userId) {
            localStorage.setItem(this.userIdKey, res.userId);
          }
        })
      );
  }

getMe(): Observable<any> {
  const token = this.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get(`${this.apiUrl}/me`, { headers });
}


  // Déconnexion (backend + localStorage)

  logout(): Observable<any> {
  const token = this.getToken(); 
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
}


  // Récupérer le token actuel
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Récupérer l'ID utilisateur stocké
  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  // Vérifier si connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Supprimer le token et l'ID localement après déconnexion
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
  }
}
