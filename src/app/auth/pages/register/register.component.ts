import { User } from './../../interfaces/user.interface';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { LoginResponse } from '../../interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(private router: Router) {}
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  public myForm: FormGroup=this.fb.group({
    //number: ['',[Validators.required,Validators.minLength(6),Validators.maxLength(6)]],
    name: ['',Validators.required],
    lastname: ['',Validators.required],
    birth: ['',Validators.required],
    gender: ['',Validators.required],
    phone: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
    password: ['',[Validators.required,Validators.minLength(10)]],
  });

  register() {
    const { number, name, lastname, birth, gender, phone, password } = this.myForm.value;

    this.authService.register(number, name, lastname, birth, gender, phone, password)
      .subscribe({
        next: (response:LoginResponse) => {
          const userNumber = response.user.number;
          Swal.fire({
            html: `
                <a style="font-family: 'Georama';font-size: 20px;font-weight:500">Registro Exitoso</a><br>
                <a style="font-family: 'Georama';font-size: 20px;font-weight:400">Tu número de usuario es: ${userNumber}</a>
              `,
            icon: "success",
          }).then(() => {
            this.router.navigateByUrl('/paciente'); // Redirige al usuario tras el registro
          });
        },
        error: (message) => {
          Swal.fire({
            html:`
                <a style="font-family: 'Georama';font-size: 20px;font-weight:500">Error</a><br>
                <a style="font-family: 'Georama';font-size: 20px;font-weight:400">${message}</a>
              `,
            icon:"error",
          });
        }
      });
  }

}
