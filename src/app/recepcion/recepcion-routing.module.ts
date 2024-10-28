import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRecepcionComponent } from './layouts/dashboard-recepcion/dashboard-recepcion.component';
import { BuscarComponent } from './layouts/buscar/buscar.component';
import { RegistroComponent } from './layouts/registro/registro.component';

const routes: Routes = [
  {
    path:'',component:DashboardRecepcionComponent,
    //children:[]
  },
  {path:'busqueda/:number',component:BuscarComponent},
  {path:'registro',component:RegistroComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecepcionRoutingModule { }
