import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-comision',
  templateUrl: './comision.component.html',
  styleUrls: ['./comision.component.scss']
})
export class ComisionComponent {
  historiales: any[] = [];
  comision_historiales: any[]=[];
  comision_total: number = 0.0;
  patientId: string ='';
  current_month:string='';
  current_year:number=0;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  private authService = inject(AuthService);
  private readonly baseUrl: string = environment.baseUrl;

  public user = computed(() => this.authService.currentUser());
  public userName = this.user()?.name;
  public userNumber = this.user()?.number.toString();

  ngOnInit(): void{
    const date = new Date();
    const month =date.getMonth();
    const months=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    this.current_month=months[month];
    this.current_year = date.getFullYear();
    this.getComisionSummary();
  }

  private getComisionSummary(): void {
    this.http.get<any[]>(`${this.baseUrl}/historial/analysis-lab/${this.userNumber}`)
      .pipe(
        tap(data => {
          data.forEach(historial => {
            if (historial.status === 'Resultados listos') {
              this.comision_historiales.push(historial);
              this.comision_total += historial.lab_comision;
            }
          });
        })

      )
      .subscribe({
        next: () => {},
        error: err => console.error('Error al obtener el resumen de análisis:', err) // Manejo de errores
      });
  }

  volver(){
    this.router.navigate(['/laboratorista']);
  }
}
