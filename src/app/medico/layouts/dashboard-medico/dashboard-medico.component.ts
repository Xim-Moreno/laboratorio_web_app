import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-dashboard-medico',
  templateUrl: './dashboard-medico.component.html',
  styleUrls: ['./dashboard-medico.component.scss']
})
export class DashboardMedicoComponent {

  constructor(private http: HttpClient,private router: Router) {}

  private authService = inject(AuthService);
  private readonly baseUrl: string = environment.baseUrl;

  public user = computed(() => this.authService.currentUser());
  public userName = this.user()?.name;

  private fb = inject(FormBuilder);
  public myForm: FormGroup=this.fb.group({
    patient_id: ['',[Validators.minLength(6),Validators.maxLength(6)]],
  });

  buscarPaciente(){
    const { patient_id} = this.myForm.value;
    this.router.navigate(['/medico/busqueda',patient_id]);
  }

  goToComisiones() {
    this.router.navigate(['/medico/comisiones']);
  }

  goToRegistroPaciente() {
    this.router.navigate(['/medico/paciente']);
  }

  goToSolicitudPaciente() {
    this.router.navigate(['/medico/solicitud']);
  }

}
