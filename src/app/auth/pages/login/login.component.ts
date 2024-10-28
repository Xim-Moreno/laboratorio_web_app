import { AuthService } from './../../services/auth.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { LoginResponse } from '../../interfaces/login-response.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router) {}
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  public myForm: FormGroup=this.fb.group({
    number:   ['',[Validators.required,Validators.minLength(6),Validators.maxLength(6)]],
    password:['',[Validators.required,Validators.minLength(10)]],
  });

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  login() {
    const { number, password } = this.myForm.value;
    this.authService.login(number, password).subscribe({
      next: (response: LoginResponse) => {
        // Suponiendo que el `user` tiene un campo `role` que define si es paciente o médico
        const userRole = response.user.roles;

        if (userRole === 'paciente') {
          this.router.navigateByUrl('/paciente'); // Redirige a la página del paciente
        } else if (userRole === 'medico') {
          this.router.navigateByUrl('/medico'); // Redirige a la página del médico
        } else if (userRole === 'laboratorista') {
          this.router.navigateByUrl('/laboratorista'); // Redirige a la página del médico
        }else {
          // Manejo para otros roles si es necesario
        }
      },
      error: (message) => {
        Swal.fire({
          html: `
            <a style="font-family: 'Georama';font-size: 20px;font-weight:500">Error</a><br>
            <a style="font-family: 'Georama';font-size: 20px;font-weight:400">${message}</a>
          `,
          icon: "error",
        });
      }
    });
  }


}
