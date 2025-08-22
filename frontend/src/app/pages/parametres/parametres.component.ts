import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';
import { SettingsHeaderComponent } from '../../components/settings-header/settings-header.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SettingsHeaderComponent],
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.css']
})
export class ParametresComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;  
  userId: string = '';

  showPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {
    // Formulaire profil
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ip: [''],
      telephone: [''],
      poste: [''],
      direction: [''],
      service: ['']
    });

    // Formulaire mot de passe
    this.passwordForm = this.fb.group({
      current: ['', Validators.required],
      new: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

    ngOnInit() {
    this.authService.getMe().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.profileForm.patchValue({
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          ip: user.ip,
          telephone: user.telephone,
          poste: user.poste,
          direction: user.direction,
          service: user.service
        });
      },
      error: (err) => console.error('Impossible de récupérer les infos', err)
    });
  }

  // Vérifie que "new" et "confirm" correspondent
  passwordMatchValidator(form: FormGroup) {
    return form.get('new')?.value === form.get('confirm')?.value
      ? null
      : { mismatch: true };
  }

  saveChanges() {
    if (!this.profileForm.valid) return;

    this.employeeService.updateEmployee(this.userId, this.profileForm.value)
      .subscribe({
        next: (res) => console.log('Profil mis à jour', res),
        error: (err) => console.error('Erreur mise à jour', err)
      });
  }
  changePassword() {
  if (!this.passwordForm.valid) {
    console.error('Formulaire mot de passe invalide');
    return;
  }

  const { current, new: newPass, confirm } = this.passwordForm.value;

  this.employeeService.changePassword(this.userId, current, newPass, confirm)
    .subscribe({
      next: (res) => {
        
        Swal.fire({
          icon: 'success',
          title: 'Mot de passe mis à jour !',
          text: res.message,
          timer: 2000,        
          showConfirmButton: false
        });

        this.passwordForm.reset();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.error?.message || 'Impossible de changer le mot de passe',
          timer: 3000,
          showConfirmButton: false
        });
        console.error('Erreur changement mot de passe', err);
      }
    });
}
}
