import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.scss']
})
export class ExamenComponent {
  constructor(private http: HttpClient, private router: Router) {}

  private authService = inject(AuthService);
  private readonly baseUrl: string = environment.baseUrl;

  public user = computed(() => this.authService.currentUser());
  public userName = this.user()?.name;

  citas: any[] = [];
  patientName: string = '';
  examDetails: string = '';
  examHour: string = '';
  patientData: any = {};
  citaId: string = '';
  doctorId: string = '';
  data: any = {};
  muestra: any = false;
  comision: number = 0.0;
  prices: any = {
    'Hemograma completo': 210.0,
    'Perfil lipídico': 435.0,
    'Glucosa en sangre': 220.0,
    'Examen general de orina': 190.0,
    'Prueba de embarazo en sangre': 250.0
  }

  private fb = inject(FormBuilder);
  public myForm: FormGroup=this.fb.group({
    patient_id: ['',[Validators.required, Validators.minLength(6),Validators.maxLength(6)]],
    date: [new Date().toISOString().substring(0, 10), Validators.required]
  });

  buscarCita(){
    const patientId = this.myForm.get('patient_id')?.value; // Obtener patient_id del formulario
    const selectedDate = this.myForm.get('date')?.value; // Obtener fecha del formulario
    let citaEncontrada = false;
    let examenRegistrado = false;

    this.http.get<any[]>(`${this.baseUrl}/cita/patient-cita/${patientId}`)
    .pipe(
      tap(data => {
        this.citas = data;
        for (let cita of this.citas) {
          console.log(cita.date);
          console.log(selectedDate);
          if (cita.date == selectedDate){
            this.muestra = cita.muestra;
            if (!this.muestra){
              this.getPatientName(patientId);
              this.examDetails = cita.analysis;
              this.examHour = cita.hour;
              this.citaId = cita._id;
              if (cita.doctor_id == ""){
                this.doctorId = "none";
              }else{
                this.doctorId = cita.doctor_id;
              }
              citaEncontrada = true;
            } else{
              examenRegistrado = true;
            }
            break;
          }
        }
        if (examenRegistrado){
          Swal.fire({
            html:`
                <a style="font-family: 'Georama';font-size: 20px;font-weight:500">Examen registrado anteriormente</a><br>
              `,
            icon:"error",
          });
          this.router.navigateByUrl('/laboratorista/examen');
        }else if(!citaEncontrada){
          Swal.fire({
            html:`
                <a style="font-family: 'Georama';font-size: 20px;font-weight:500">Cita no encontrada</a><br>
              `,
            icon:"error",
          });
          this.router.navigateByUrl('/laboratorista/examen');
        }
      })
    )
    .subscribe({
      next: () => {},
      error: err => {
        console.error('Error al obtener citas:', err);
      }

    });

  }

  private getPatientName(patient:string){
    this.http.get<any>(`${this.baseUrl}/auth/patient/${patient}`)
    .pipe(
      tap(data => {
        // Almacena la información del paciente obtenida
        this.patientData = data;
        this.patientName = this.patientData['name'] + ' ' + this.patientData['lastname'];
      })
    )
    .subscribe({
      next: () => {},
      error: err => {
        console.error('Error al obtener datos del paciente:', err);
      }
    });
  }

  updateMuestra(id: string, muestra: boolean) {
    const url = `${this.baseUrl}/cita/${id}/muestra`;
    const body = new HttpParams().set('muestra', muestra.toString());
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.patch(url, body.toString(), { headers })
      .subscribe(
        response => {
          console.log('Cita actualizada con éxito', response);
        },
        error => {
          console.error('Error al actualizar la cita', error);
        }
      );
  }

  createHistorial(historialData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/historial/create-historial`, historialData);
  }

  registrarCita(){
    this.data = {
      "patient_id" : this.myForm.get('patient_id')?.value,
      "date" : this.myForm.get('date')?.value,
      "analysis" : this.examDetails,
      "doctor_id" : this.doctorId,
      "lab_id" : this.user()?.number,
      "lab_comision" : this.prices[this.examDetails]*0.05,
      "status" : "En revisión",
      "data" : {'analysis' : this.examDetails},
    }

    this.createHistorial(this.data).subscribe({
      next: (response) => {
        this.updateMuestra(this.citaId,true);
        this.router.navigateByUrl('/laboratorista');
        Swal.fire({
          html:`
              <a style="font-family: 'Georama';font-size: 20px;font-weight:500">Examen registrado con éxito</a><br>
            `,
          icon:"success",
        });
        //this.eliminarCita(this.citaId);
      },
      error: (error) => {
        console.error('Error al guardar el historial:', error);
      }
    });

  }

}

