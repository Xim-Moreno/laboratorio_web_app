import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss']
})
export class ResultadosComponent {
  constructor(private http: HttpClient, private router: Router) {}

  private authService = inject(AuthService);
  private readonly baseUrl: string = environment.baseUrl;

  public user = computed(() => this.authService.currentUser());
  public userName = this.user()?.name;

  citas: any[] = [];
  historials: any[] = [];
  data: any = {};
  citaEncontrada: any = false;
  citaId : string = '';
  citaMuestra: any = false;

  options = [
    { value: 'none', name: 'Seleccione uno de los exámenes disponibles.' },
    { value: 'Hemograma completo', name: 'Hemograma completo' },
    { value: 'Perfil lipídico', name: 'Perfil lipídico' },
    { value: 'Glucosa en sangre', name: 'Glucosa en sangre'},
    { value: 'Examen general de orina', name: 'Examen general de orina' },
    { value: 'Prueba de embarazo en sangre', name: 'Prueba de embarazo en sangre' }
  ];

  analysis1 = false;
  analysis2 = false;
  analysis3 = false;
  analysis4 = false;
  analysis5 = false;

  private fb = inject(FormBuilder);
  public formSeleccionar: FormGroup=this.fb.group({
    analysis: ['none',Validators.required],
    date: [new Date().toISOString().substring(0, 10), [Validators.required]],
    patient_id: ['',[Validators.required, Validators.minLength(6),Validators.maxLength(6)]],
    doctor_id: [''],
    globulos_rojos: [''],
    hemoglobina: [''],
    hematrocito: [''],
    globulos_blancos: [''],
    plaquetas: [''],
    colesterol: [''],
    hdl: [''],
    ldl: [''],
    vldl: [''],
    trigliceridos: [''],
    glucemia: [''],
    color: [''],
    aspecto: [''],
    pH: [''],
    densidad: [''],
    glucosa: [''],
    proteinas: [''],
    leucocitos: [''],
    cetonas: [''],
    urobilinogeno: [''],
    bilirrubina: [''],
    nitritos: [''],
    cristales: [''],
    epitelial_cilindro: [''],
    ascorbico: [''],
    gch: [''],
  });

  buscarCita(): Promise<boolean[]> {
    return new Promise((resolve, reject) => {
      const patientId = this.formSeleccionar.get('patient_id')?.value; // Obtener patient_id del formulario
      const selectedDate = this.formSeleccionar.get('date')?.value; // Obtener fecha del formulario
      const selectedAnalysis = this.formSeleccionar.get('analysis')?.value;
      this.citaEncontrada = false; // Inicializar la variable
      this.citaMuestra = false;

      this.http.get<any[]>(`${this.baseUrl}/cita/patient-cita/${patientId}`)
        .pipe(
          tap(data => {
            this.citas = data;

            // Verificar si no se encontraron citas
            if (!data || data.length === 0) {
              Swal.fire({
                html: `
                  <a style="font-family: 'Georama'; font-size: 20px; font-weight: 500">No se encontraron citas para el paciente.</a><br>
                `,
                icon: "error",
              });
              resolve([false]); // No se encontraron citas
              return; // Salir de la función
            }

            for (let cita of this.citas) {
              if (cita.date == selectedDate && cita.analysis == selectedAnalysis) {
                this.citaEncontrada = true;
                if (cita.muestra){
                  this.citaEncontrada = true;
                  this.citaId = cita._id;
                  this.citaMuestra = true;
                  break;
                }
              }
            }

          })
        )
        .subscribe({
          next: () => {
            if (!this.citaEncontrada){
              Swal.fire({
                html: `
                  <a style="font-family: 'Georama'; font-size: 20px; font-weight: 500">Examen no encontrado</a><br>
                `,
                icon: "error",
              });
            }else if(!this.citaMuestra){
              Swal.fire({
                html: `
                  <a style="font-family: 'Georama'; font-size: 20px; font-weight: 500">La muestra para el examen no ha sido registrada</a><br>
                `,
                icon: "error",
              });
            }
            resolve([this.citaEncontrada, this.citaMuestra]); // Resuelve la promesa con el valor actual de citaEncontrada
          },
          error: err => {
            console.error('Error al obtener citas:', err);
            reject(err); // Rechaza la promesa en caso de error
          }
        });
    });
  }

  async seleccionarExamen(){
    const [findCita, findMuestra] = await this.buscarCita();
    const selectedAnalysis = this.formSeleccionar.get('analysis')?.value;
    if (findCita && findMuestra){
      if (selectedAnalysis == 'Hemograma completo'){
        this.analysis1 = true;
        this.analysis2 = false;
        this.analysis3 = false;
        this.analysis4 = false;
        this.analysis5 = false;
      }else if(selectedAnalysis == 'Perfil lipídico'){
        this.analysis1 = false;
        this.analysis2 = true;
        this.analysis3 = false;
        this.analysis4 = false;
        this.analysis5 = false;
      }else if(selectedAnalysis == 'Glucosa en sangre'){
        this.analysis1 = false;
        this.analysis2 = false;
        this.analysis3 = true;
        this.analysis4 = false;
        this.analysis5 = false;
      }else if(selectedAnalysis == 'Examen general de orina'){
        this.analysis1 = false;
        this.analysis2 = false;
        this.analysis3 = false;
        this.analysis4 = true;
        this.analysis5 = false;
      }else if(selectedAnalysis == 'Prueba de embarazo en sangre'){
        this.analysis1 = false;
        this.analysis2 = false;
        this.analysis3 = false;
        this.analysis4 = false;
        this.analysis5 = true;
      }else{
        this.analysis1 = false;
        this.analysis2 = false;
        this.analysis3 = false;
        this.analysis4 = false;
        this.analysis5 = false;
      }
    }
  }

  registrarExamen(){
    const {analysis, patient_id, date, doctor_id} = this.formSeleccionar.value;
    const status = 'Resultados listos';
    this.http.get<any[]>(`${this.baseUrl}/historial/patient-historial/${patient_id}`)
    .pipe(
      tap(data => {
        this.historials = data;
        for (let historial of this.historials) {
          if (historial.date == date && historial.analysis == analysis){
            console.log(historial._id);
            if (historial.analysis == 'Hemograma completo'){
              const {globulos_rojos, globulos_blancos, hemoglobina, hematrocito, plaquetas} =this.formSeleccionar.value;
              let historial_id = historial._id;
              this.data = {
                "globulos_rojos" : globulos_rojos,
                "globulos_blancos" : globulos_blancos,
                "hemoglobina" : hemoglobina,
                "hematrocito" : hematrocito,
                "plaquetas" : plaquetas
              }
              this.updateHistorialData(historial_id,this.data, status);
              this.eliminarCita(this.citaId);
            }else if (historial.analysis == 'Perfil lipídico'){
              const {colesterol, hdl, ldl, vldl, trigliceridos} =this.formSeleccionar.value;
              let historial_id = historial._id;
              this.data = {
                "colesterol" : colesterol,
                "hdl" : hdl,
                "ldl" : ldl,
                "vldl" : vldl,
                "trigliceridos" : trigliceridos
              }
              this.updateHistorialData(historial_id,this.data, status);
              this.eliminarCita(this.citaId);
            }else if (historial.analysis == 'Glucosa en sangre'){
              const {glucemia} =this.formSeleccionar.value;
              let historial_id = historial._id;
              this.data = {
                "glucemia" : glucemia
              }
              this.updateHistorialData(historial_id,this.data, status);
              this.eliminarCita(this.citaId);
            }else if (historial.analysis == 'Examen general de orina'){
              const {color, aspecto, densidad, pH, glucosa, proteinas, cetonas, bilirrubina, urobilinogeno, leucocitos, hemoglobina, nitritos, globulos_rojos, cristales, epitelial_cilindro, ascorbico} =this.formSeleccionar.value;
              let historial_id = historial._id;
              this.data = {
                "color" : color,
                "aspecto" : aspecto,
                "densidad" : densidad,
                "pH" : pH,
                "glucosa" : glucosa,
                "proteinas" : proteinas,
                "cetonas" : cetonas,
                "bilirrubina" : bilirrubina,
                "urobilinogeno" : urobilinogeno,
                "leucocitos" : leucocitos,
                "hemoglobina" : hemoglobina,
                "nitritos" : nitritos,
                "globulos_rojos" : globulos_rojos,
                "cristales" : cristales,
                "epitelial_cilindro" : epitelial_cilindro,
                "ascorbico" : ascorbico
              }
              this.updateHistorialData(historial_id,this.data, status);
              this.eliminarCita(this.citaId);
            }else if (historial.analysis == 'Prueba de embarazo en sangre'){
              const {gch} =this.formSeleccionar.value;
              let historial_id = historial._id;
              this.data = {
                "gch" : gch
              }
              this.updateHistorialData(historial_id,this.data, status);
              this.eliminarCita(this.citaId);
            }
            this.router.navigateByUrl('/laboratorista');
          }
        }
      })
    )
    .subscribe({
      next: () => {},
      error: err => {
        console.error('Error al obtener historiales:', err);
      }
    });
  }

  updateHistorialData(id: string, data: Record<string, any>, status: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.patch(`${this.baseUrl}/historial/update-data/${id}`, {data, status}, { headers })
      .subscribe(
        response => {
          console.log('Datos del historial actualizados con éxito', response);
          Swal.fire({
            html:`
                <a style="font-family: 'Georama';font-size: 20px;font-weight:500">Resultados de examen guardados</a><br>
              `,
            icon:"success",
          });
        },
        error => {
          console.error('Error al actualizar los datos del historial', error);
          Swal.fire({
            html:`
                <a style="font-family: 'Georama';font-size: 20px;font-weight:500">Error al guardar resultados</a><br>
              `,
            icon:"error",
          });
        }
      );
  }

  eliminarCita(citaId: string){
    this.http.delete(`${this.baseUrl}/cita/${citaId}/delete`)
        .subscribe({
          next: () => {
            console.log('Cita eliminada con éxito');
          },
          error: err => {
            console.error('Error al eliminar la cita:', err);
          }
        });
  }
}
