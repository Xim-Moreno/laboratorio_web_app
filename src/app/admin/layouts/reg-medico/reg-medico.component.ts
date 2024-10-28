import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './reg-medico.component.html',
  styleUrls: ['./reg-medico.component.scss']
})
export class RegMedicoComponent {
  constructor(private http: HttpClient,private router: Router) {}
  private fb = inject(FormBuilder);

  private authService = inject(AuthService);
  private readonly baseUrl: string = environment.baseUrl;

  public user = computed(() => this.authService.currentUser());
  public userName = this.user()?.name;

  public myForm: FormGroup=this.fb.group({
    //number: ['',[Validators.required,Validators.minLength(6),Validators.maxLength(6)]],
    name: ['',Validators.required],
    lastname: ['',Validators.required],
    especialidad: ['',Validators.required],
    cedula: ['',Validators.required],
    birth: ['',Validators.required],
    gender: ['',Validators.required],
    phone: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
    password: ['',[Validators.required,Validators.minLength(10)]],
  });

  register() {
    const { number, name, lastname, birth, gender, phone, password, especialidad, cedula } = this.myForm.value;

    this.authService.register(number, name, lastname, birth, gender, phone, password, 'medico', especialidad, cedula)
      .subscribe({
        next: (response:LoginResponse) => {
          const userNumber = response.user.number;
          Swal.fire({
            html: `
                <a style="font-family: 'Georama';font-size: 20px;font-weight:500">Registro Exitoso</a><br>
                <a style="font-family: 'Georama';font-size: 20px;font-weight:400">El número de usuario es: ${userNumber}</a>
              `,
            icon: "success",
          }).then(() => {
            this.router.navigateByUrl('/admin');
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
