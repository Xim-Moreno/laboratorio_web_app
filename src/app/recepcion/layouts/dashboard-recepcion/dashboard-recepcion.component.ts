import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-recepcion',
  templateUrl: './dashboard-recepcion.component.html',
  styleUrls: ['./dashboard-recepcion.component.scss']
})
export class DashboardRecepcionComponent {
  constructor(private http: HttpClient,private router: Router) {}

  private authService = inject(AuthService);
  private readonly baseUrl: string = environment.baseUrl;

  public user = computed(() => this.authService.currentUser());
  public userName = this.user()?.name;

  private fb = inject(FormBuilder);
  public myForm: FormGroup=this.fb.group({
    patient_id: ['',[Validators.minLength(6),Validators.maxLength(6)]],
  });

  current_month:string = '';
  current_year:number = 0;
  current_day:number = 0;
  current_date: string = '';
  citas: any[] = [];
  names: any =  {};

  ngOnInit(): void{
    const date = new Date();
    const month =date.getMonth();
    const months=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    this.current_month=months[month];
    this.current_year = date.getFullYear();
    this.current_day = date.getDate();
    this.current_date = this.current_year+'-'+(month+1).toString()+'-'+this.current_day;
    this.getCitas();
  }

  buscarPaciente(){
    const { patient_id} = this.myForm.value;
    this.http.get<any>(`${this.baseUrl}/auth/patient/${patient_id}`)
    .pipe(
      tap(data => {
        if (data) {
          if (data.roles == "paciente"){
            this.router.navigate(['/recepcion/busqueda',patient_id]);
          }else{
            Swal.fire({
              html:`
                  <a style="font-family: 'Georama';font-size: 20px;font-weight:500">El usuario no es un paciente</a><br>
                `,
              icon:"error",
            });
            this.router.navigate(['/recepcion']);
          }

        }
      })
    )
    .subscribe({
      next: () => {},
      error: err =>{
         console.error('Error al obtener datos del paciente:', err); // Manejo de errores
         Swal.fire({
          html:`
              <a style="font-family: 'Georama';font-size: 20px;font-weight:500">Paciente no encontrado</a><br>
            `,
          icon:"error",
        });
        this.router.navigate(['/recepcion']);
      }
    });
  }

  goToRegistroPaciente() {
    this.router.navigate(['/recepcion/registro']);
  }

  private getCitas(): void {
    this.http.get<any[]>(`${this.baseUrl}/cita/citas`)
    .pipe(
      tap(data => {
        data.forEach(cita => {
          if (cita.date === this.current_date) {
            this.citas.push(cita);
            this.getPatient(cita.patient_id);
          }
        });
      })
    )
    .subscribe({
      next: () => {},
      error: err => console.error('Error al obtener citas:', err) // Manejo de errores
    });
  }

  private getPatient(patient_id:string){
    this.http.get<any>(`${this.baseUrl}/auth/patient/${patient_id}`)
    .pipe(
      tap(data => {
        if (data) {
          const { name, lastname } = data; // Extraer los valores
          this.names[patient_id] = name + ' ' + lastname;
        }
      })
    )
    .subscribe({
      next: () => {},
      error: err =>{
         console.error('Error al obtener datos del paciente:', err); // Manejo de errores
      }
    });
  }
}
