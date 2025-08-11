import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  connexionForm: FormGroup;
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.connexionForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        //a enlever plus tard apres les tests
        /* Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/) */
      ]]
    });
  }

  onSubmit() {
    if (this.connexionForm.valid) {
      const { email, password } = this.connexionForm.value;
      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          console.log('Connexion réussie', response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/admin']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erreur de connexion', error);
          if (error.status === 404) {
            this.errorMessage = 'Votre adresse email n\'existe pas.';
          } else if (error.status === 403) {
            this.errorMessage = 'Vous ne disposez pas des autorisations de connexion.';
          } else if (error.status === 401) {
            this.errorMessage = 'Votre mot de passe est incorrect.';
          } else {
            this.errorMessage = 'Une erreur est survenue lors de la connexion.';
          }
        }
      });
    } else {
      console.log('Formulaire invalide');
      this.connexionForm.markAllAsTouched();
    }
  }
}
