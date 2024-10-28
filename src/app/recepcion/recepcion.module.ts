import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRecepcionComponent } from './layouts/dashboard-recepcion/dashboard-recepcion.component';
import { RecepcionRoutingModule } from './recepcion-routing.module';
import { BuscarComponent } from './layouts/buscar/buscar.component';
import { RegistroComponent } from './layouts/registro/registro.component';



@NgModule({
  declarations: [
    DashboardRecepcionComponent,
    BuscarComponent,
    RegistroComponent
  ],
  imports: [
    CommonModule,
    RecepcionRoutingModule,
    ReactiveFormsModule
  ]
})
export class RecepcionModule { }
