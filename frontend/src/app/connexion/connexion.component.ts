import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  connexionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.connexionForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(
          // Regex stricte pour email
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        )
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          // Regex mot de passe fort : min 8, majuscule, minuscule, chiffre, spécial
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
        )
      ]]
    });
  }

  onSubmit() {
    if (this.connexionForm.valid) {
      console.log('Formulaire valide :', this.connexionForm.value);
      // Tu peux ici appeler un service pour te connecter
    } else {
      console.log('Formulaire invalide');
      this.connexionForm.markAllAsTouched(); // pour afficher les erreurs
    }
  }

}
