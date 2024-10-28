import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardAdminComponent } from './layouts/dashboard-admin/dashboard-admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { RegPacienteComponent } from './layouts/reg-paciente/reg-paciente.component';
import { RegMedicoComponent } from './layouts/reg-medico/reg-medico.component';
import { RegLabComponent } from './layouts/reg-lab/reg-lab.component';



@NgModule({
  declarations: [
    DashboardAdminComponent,
    RegPacienteComponent,
    RegMedicoComponent,
    RegLabComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
