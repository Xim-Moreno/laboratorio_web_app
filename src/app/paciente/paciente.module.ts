import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PacienteRoutingModule } from './paciente-routing.module';
import { DashboardPacienteComponent } from './layouts/dashboard-paciente/dashboard-paciente.component';
import { HttpClientModule } from '@angular/common/http';
import { SolicitudComponent } from './layouts/solicitud/solicitud.component';
import { ResultadosComponent } from './layouts/resultados/resultados.component';


@NgModule({
  declarations: [
    DashboardPacienteComponent,
    SolicitudComponent,
    ResultadosComponent,
  ],
  imports: [
    CommonModule,
    PacienteRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class PacienteModule { }
