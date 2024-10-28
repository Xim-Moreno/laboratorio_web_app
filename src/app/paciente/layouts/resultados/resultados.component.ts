import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';
import { DashboardPacientComponent } from 'src/app/pages/pacient/dashboard-pacient/dashboard-pacient.component';
import { HistorialService } from '../../services/historial.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss']
})
export class ResultadosComponent {
  historiales: any[] = [];
  selectedHistorial: string = '';
  analysis: string = '';
  date: string = '';
  data: any = {};
  lab_name: string = '';

  constructor(private http: HttpClient,private router: Router, private historialService: HistorialService) {}

  private authService = inject(AuthService);
  private readonly baseUrl: string = environment.baseUrl;

  public user = computed(() => this.authService.currentUser());
  public userName = this.user()?.name;

  ngOnInit(): void {
    this.historiales = this.historialService.getHistoriales();
    this,this.selectedHistorial = this.historialService.getSelectedHistorial();
    for (let historial of this.historiales){
      if (historial._id == this.selectedHistorial){
        this.analysis = historial.analysis;
        this.date = historial.date;
        this.data = historial.data;
        this.getLabName(historial.lab_id);
      }
    }
  }

  getLabName(lab_id:string): void{
    this.http.get<any>(`${this.baseUrl}/auth/patient/${lab_id}`)
    .pipe(
      tap(data => {
        if (data) {
          const { name, lastname } = data; // Extraer los valores
          this.lab_name = name + ' ' + lastname;
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

  volver(){
    this.router.navigate(['/paciente']);
  }
}

