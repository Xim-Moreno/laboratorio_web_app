import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLaboratoristaComponent } from './layouts/dashboard-laboratorista/dashboard-laboratorista.component';
import { LaboratoristaRoutingModule } from './laboratorista-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { BuscarComponent } from './layouts/buscar/buscar.component';
import { ExamenComponent } from './layouts/examen/examen.component';
import { ResultadosComponent } from './layouts/resultados/resultados.component';
import { VerResultadosComponent } from './layouts/ver-resultados/ver-resultados.component';
import { InformeComponent } from './layouts/informe/informe.component';



@NgModule({
  declarations: [
    DashboardLaboratoristaComponent,
    BuscarComponent,
    ExamenComponent,
    ResultadosComponent,
    VerResultadosComponent,
    InformeComponent
  ],
  imports: [
    CommonModule,
    LaboratoristaRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class LaboratoristaModule { }
