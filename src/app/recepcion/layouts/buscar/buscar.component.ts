import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HistorialService } from 'src/app/paciente/services/historial.service';
import { environment } from 'src/environments/environments';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss']
})
export class BuscarComponent {
  historiales: any[] = [];
  citas: any[] = [];
  patientId: string =''; // Almacena el ID del paciente
  patientData: any[]=[]; // Almacena la información del paciente
  name: string = '';
  lastname: string = '';
  historialResultado: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private historialService: HistorialService, private router: Router) {}

  private authService = inject(AuthService);
  private readonly baseUrl: string = environment.baseUrl;

  public user = computed(() => this.authService.currentUser());
  public userName = this.user()?.name;


  ngOnInit(): void {
    // Obtén el ID del paciente desde la URL
    this.route.params.subscribe(params => {
      this.patientId = params['number']; // Asegúrate de que 'id' coincida con el parámetro en la ruta
      const name= this.getPatient();
      this.getHistoriales();
      this.getCitas();
    });
  }

  viewResults(historial: any){
    this.historialResultado = historial._id;
    this.historialService.setSelectedHistorial(this.historialResultado);
    this.router.navigate(['/laboratorista/ver_resultados']);
  }

  private getPatient(){
    this.http.get<any>(`${this.baseUrl}/auth/patient/${this.patientId}`)
    .pipe(
      tap(data => {
        if (data) {
          const { name, lastname } = data; // Extraer los valores
          this.name = name; // Almacena el nombre
          this.lastname = lastname; // Almacena el apellido
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

  private getHistoriales(): void {
    this.http.get<any[]>(`${this.baseUrl}/historial/patient-historial/${this.patientId}`)
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
    this.http.get<any[]>(`${this.baseUrl}/cita/patient-cita/${this.patientId}`)
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
