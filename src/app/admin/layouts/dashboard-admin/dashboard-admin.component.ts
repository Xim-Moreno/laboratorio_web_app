import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';

type AnalysisType = 'Hemograma completo' | 'Perfil lipidico' | 'Glucosa en sangre' | 'Examen general de orina' | 'Prueba de embarazo en sangre';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent {
  constructor(private http: HttpClient,private router: Router) {}

  private authService = inject(AuthService);
  private readonly baseUrl: string = environment.baseUrl;

  public user = computed(() => this.authService.currentUser());
  public userName = this.user()?.name;

  current_month:string='';
  current_year:number=0;
  public analysisSums: Record<AnalysisType, number> = {
    'Hemograma completo': 0,
    'Perfil lipidico': 0,
    'Glucosa en sangre': 0,
    'Examen general de orina': 0,
    'Prueba de embarazo en sangre': 0
  };

  ngOnInit(): void{
    const date = new Date();
    const month =date.getMonth();
    const months=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    this.current_month=months[month];
    this.current_year = date.getFullYear();
    this.getAnalysisSummary();
  }

  private getAnalysisSummary(): void {
    this.http.get<{ [key: string]: number }>(`${this.baseUrl}/historial/analysis-summary`)
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

  registroPaciente(){
    this.router.navigate(['/admin/registro-paciente']);
  }
  registroMedico(){
    this.router.navigate(['/admin/registro-medico']);
  }
  registroLab(){
    this.router.navigate(['/admin/registro-lab']);
  }
}
