import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
  connexionForm: FormGroup;
  private authService = inject(AuthService);
  private router = inject(Router);

  emailErrorMessage: string = '';
  passwordErrorMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.connexionForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),/* 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/) */
      ]]
    });
  }

  ngOnInit() {
    // Reset messages d'erreur à chaque modification
    this.connexionForm.valueChanges.subscribe(() => {
      this.emailErrorMessage = '';
      this.passwordErrorMessage = '';
    });
  }

  showPassword = true

    onSubmit() {
  if (this.connexionForm.invalid) return;

  const { email, password } = this.connexionForm.value;

  this.authService.login(email, password).subscribe({
    next: (res) => {
      if (res.token) {
        // Stockage du token dans le localStorage
        localStorage.setItem('auth_token', res.token);

        console.log('Token JWT stocké :', res.token);
      }

      // Redirection après connexion réussie
      this.router.navigate(['/admin']);
    },
    error: (error: HttpErrorResponse) => {
      this.emailErrorMessage = '';
      this.passwordErrorMessage = '';

      if (error.status === 404) this.emailErrorMessage = "Votre adresse email n'existe pas.";
      else if (error.status === 403) this.emailErrorMessage = "Vous ne disposez pas des autorisations de connexion.";
      else if (error.status === 401) this.passwordErrorMessage = "Votre mot de passe est incorrect.";
      else this.emailErrorMessage = "Une erreur est survenue.";
    }
  });
}
}
