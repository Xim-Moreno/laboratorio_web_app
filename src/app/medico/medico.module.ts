import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { DashboardMedicoComponent } from './layouts/dashboard-medico/dashboard-medico.component';
import { ComisionComponent } from './layouts/comision/comision.component';
import { MedicoRoutingModule } from './medico-routing.module';
import { RegistroComponent } from './layouts/registro/registro.component';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { SolicitudComponent } from './layouts/solicitud/solicitud.component';
import { BuscarComponent } from './layouts/buscar/buscar.component';
import { ResultadosComponent } from './layouts/resultados/resultados.component';


@NgModule({
  declarations: [
    DashboardMedicoComponent,
    ComisionComponent,
    RegistroComponent,
    SolicitudComponent,
    BuscarComponent,
    ResultadosComponent,
  ],
  imports: [
    CommonModule,
    MedicoRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class MedicoModule { }
