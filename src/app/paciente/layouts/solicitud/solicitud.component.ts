import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/auth/interfaces';
import { CitaResponse } from 'src/app/auth/interfaces/cita-response.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent {
  constructor(private http: HttpClient,private router: Router) {}
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  public user = computed(() => this.authService.currentUser());
  public userName = this.user()?.name;

  public myForm: FormGroup=this.fb.group({
    patient_id: [this.user()?.number],
    analysis: ['No aplica',Validators.required],
    doctor_id: [''],
    lab_id: [''],
    date: ['', [Validators.required, this.dateValidator]],
    hour: ['', [Validators.required, this.hourValidator]]
  });

  options = [
    { value: 'none', name: 'Seleccione uno de los exámenes disponibles.', description: '' },
    { value: 'Hemograma completo', name: 'Hemograma completo', description: 'Análisis de sangre para medir cantidad de glóbulos rojos (eritrocitos), hemoglobina, hematrocitos, glóbulos blancos (leucocitos), plaquetas e índices erotrocitarios. Presentarse en ayuno (de 8 a 12 horas), evitar realizar actividad física intensa antes de la prueba, informar sobre cualquier medicamento que esté tomando y asistir con ropa cómoda.' },
    { value: 'Perfil lipídico', name: 'Perfil lipídico', description: 'Análisis de sangre para medir los niveles de diferentes tipos de grasas o lípidos en el cuerpo. Se mide el colesterol total, colesterol LDL, colesterol HDL, triglicéridos y relación colesterol total/HDL. Presentarse en ayuno (de 9 a 12 horas), evitar el consumo de alcohol por los menos 24 horas antes de la prueba e informar sobre cualquier medicamento que esté tomando.' },
    { value: 'Glucosa en sangre', name: 'Glucosa en sangre', description: 'Examen que mide la cantidad de glucosa (azúcar) presente en la sangre. Este análisis es crucial para diagnosticar y monitorear enfermedades como la diabetes y otras alteraciones relacionadas con el metabolismo de los carbohidratos. Presentarse en ayuno de por lo menos 8 horas, evitar el consulo de alcohol y ejercicio intenso antes de la prueba e informar sobre cualquier medicamento que esté tomando.' },
    { value: 'Examen general de orina', name: 'Examen general de orina', description: 'Examen diagnóstico que evalúa la composición física, química y microscópica de la orina. Se realiza un análisis físico (color, claridad y olor), un análisis químico (pH, glucosa, cuerpos cetónicos, proteínas, nitritos y leucocitos, bilirrubina, sangre) y un análisis microscópico (células, bacterias, cristales). Presentar una muestra de orina de la primera micción de la mañana y evitar alimentos o medicamentos que puedan alterar el color o la composición de la orina.' },
    { value: 'Prueba de embarazo en sangre', name: 'Prueba de embarazo en sangre', description: 'Análisis que mide la cantidad de la hormona gonadotropina coriónica humana (hCG) en la sangre de una mujer. Informar sobre cualquier medicamento que esté tomando.' }
  ];

  selectedDescription: string = '';

  dateValidator(control: AbstractControl) {
    const date = new Date(control.value);
    const day = date.getDay();
    return (day === 5 || day === 6) ? { weekend: true } : null; // Regresa un objeto si es fin de semana, null si es válido
  }

  hourValidator(control: AbstractControl) {
    const hourValue = control.value;
    const hourParts = hourValue.split(':');
    const hour = parseInt(hourParts[0], 10);
    const minute = parseInt(hourParts[1], 10);

    if (hour < 8 || hour > 17 || (hour === 17 && minute > 0)) {
      return { hourOutOfRange: true }; // Error si la hora no está en el rango
    }
    return null;
  }

  onOptionChange(): void {
    // Obtener el valor seleccionado desde el formulario
    const selectedValue = this.myForm.get('analysis')?.value;

    // Buscar la opción seleccionada en el arreglo de opciones
    const selectedOption = this.options.find(option => option.value === selectedValue);

    // Si se encuentra la opción, actualizar la descripción, si no, limpiar la descripción
    if (selectedOption) {
      this.selectedDescription = selectedOption.description;
    } else {
      this.selectedDescription = '';
    }
  }

  register_cita() {
    const { patient_id, analysis, doctor_id, lab_id, date, hour} = this.myForm.value;
    this.authService.registerCita(patient_id, analysis, doctor_id, lab_id, date, hour,)
      .subscribe({
        next: (response:LoginResponse) => {
          Swal.fire({
            html: `
                <a style="font-family: 'Georama';font-size: 20px;font-weight:500">Tu cita está registrada</a><br>
                <a style="font-family: 'Georama';font-size: 20px;font-weight:400">Fecha: ${date}</a>
                <a style="font-family: 'Georama';font-size: 20px;font-weight:400">Hora: ${hour}</a>
              `,
            icon: "success",
          }).then(() => {
            this.router.navigateByUrl('/paciente'); // Redirige al usuario tras el registro
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
