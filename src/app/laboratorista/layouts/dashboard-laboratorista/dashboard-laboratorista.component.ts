import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';
import Swal from 'sweetalert2';

type AnalysisType = 'Hemograma completo' | 'Perfil lipidico' | 'Glucosa en sangre' | 'Examen general de orina' | 'Prueba de embarazo en sangre';

@Component({
  selector: 'app-dashboard-laboratorista',
  templateUrl: './dashboard-laboratorista.component.html',
  styleUrls: ['./dashboard-laboratorista.component.scss']
})
export class DashboardLaboratoristaComponent {
  current_month:string='';
  current_year:number=0;
  public historiales: any[] = [];
  public analysisSums: Record<AnalysisType, number> = {
    'Hemograma completo': 0,
    'Perfil lipidico': 0,
    'Glucosa en sangre': 0,
    'Examen general de orina': 0,
    'Prueba de embarazo en sangre': 0
  };

  constructor(private http: HttpClient,private router: Router) {}

  private authService = inject(AuthService);
  private readonly baseUrl: string = environment.baseUrl;

  public user = computed(() => this.authService.currentUser());
  public userName = this.user()?.name;

  private fb = inject(FormBuilder);
  public myForm: FormGroup=this.fb.group({
    patient_id: ['',[Validators.minLength(6),Validators.maxLength(6)]],
  });

  ngOnInit(): void{
    const date = new Date();
    const month =date.getMonth();
    const months=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    this.current_month=months[month];
    this.current_year = date.getFullYear();
    this.getAnalysisSummary();
  }

  buscarPaciente(){
    const { patient_id} = this.myForm.value;
    this.http.get<any>(`${this.baseUrl}/auth/patient/${patient_id}`)
    .pipe(
      tap(data => {
        if (data) {
          if (data.roles == "paciente"){
            this.router.navigate(['/laboratorista/busqueda',patient_id]);
          }else{
            Swal.fire({
              html:`
                  <a style="font-family: 'Georama';font-size: 20px;font-weight:500">El usuario no es un paciente</a><br>
                `,
              icon:"error",
            });
            this.router.navigate(['/laboratorista']);
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
        this.router.navigate(['/laboratorista']);
      }
    });
  }

  goToComisiones() {
    this.router.navigate(['/medico/comisiones']);
  }

  registrarExamen(){
    const { patient_id} = this.myForm.value;
    this.router.navigate(['/laboratorista/examen']);
  }

  registrarResultados(){
    this.router.navigate(['/laboratorista/resultados']);
  }

  private getAnalysisSummary(): void {
    this.http.get<{ [key: string]: number }>(`${this.baseUrl}/historial/analysis-summary-lab/${this.user()?.number}`)
      .pipe(
        tap(data => {
          console.log(data);
          // Mapea las claves de data a las claves esperadas en analysisSums
          this.analysisSums = {
            'Hemograma completo': data['Hemograma completo'] || 0,
            'Perfil lipidico': data['Perfil lipídico'] || 0,
            'Glucosa en sangre': data['Glucosa en sangre'] || 0,
            'Examen general de orina': data['Examen general de orina'] || 0,
            'Prueba de embarazo en sangre': data['Prueba de embarazo en sangre'] || 0
          };
        })
      )
      .subscribe({
        next: () => {},
        error: err => console.error('Error al obtener el resumen de análisis:', err) // Manejo de errores
      });
  }

  generarInforme(){
    this.router.navigate(['/laboratorista/informe']);
  }

}
