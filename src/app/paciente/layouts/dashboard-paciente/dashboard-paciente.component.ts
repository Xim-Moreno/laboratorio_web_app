import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';
import { HistorialService } from '../../services/historial.service';

@Component({
  selector: 'app-dashboard-paciente',
  templateUrl: './dashboard-paciente.component.html',
  styleUrls: ['./dashboard-paciente.component.scss']
})
export class DashboardPacienteComponent {
  public historiales: any[] = [];
  citas: any[] = [];
  public historialResultado: string = '';

  constructor(private http: HttpClient,private router: Router, private historialService: HistorialService) {}

  private authService = inject(AuthService);
  private readonly baseUrl: string = environment.baseUrl;

  public user = computed(() => this.authService.currentUser());
  public userName = this.user()?.name;

  onLogout() {
    this.authService.logout();
  }

  goToSolicitud(){
    this.router.navigate(['/paciente/solicitud-cita']);
  }

  viewResults(historial: any){
    this.historialResultado = historial._id;
    this.historialService.setSelectedHistorial(this.historialResultado);
    this.router.navigate(['/paciente/resultados']);
  }

  ngOnInit(): void {
    this.getHistoriales();
    this.getCitas();
  }

  private getHistoriales(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>(`${this.baseUrl}/historial/my-historial`, { headers })
    .pipe(
      tap(data => {
        this.historiales = data;
        this.historialService.setHistoriales(data);
      })
    )
    .subscribe({
      next: () => {},
      error: err => console.error('Error al obtener historiales:', err) // Manejo de errores
    });
  }

  private getCitas(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>(`${this.baseUrl}/cita/my_citas`, { headers })
    .pipe(
      tap(data => {
        this.citas = data;
      })
    )
    .subscribe({
      next: () => {},
      error: err => console.error('Error al obtener citas:', err) // Manejo de errores
    });
  }

}

