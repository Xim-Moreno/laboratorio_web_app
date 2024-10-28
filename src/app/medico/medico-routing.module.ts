import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardMedicoComponent } from './layouts/dashboard-medico/dashboard-medico.component';
import { ComisionComponent } from './layouts/comision/comision.component';
import { RegistroComponent } from './layouts/registro/registro.component';
import { SolicitudComponent } from './layouts/solicitud/solicitud.component';
import { BuscarComponent } from './layouts/buscar/buscar.component';
import { ResultadosComponent } from './layouts/resultados/resultados.component';

const routes: Routes = [
  {
    path:'',
    component:DashboardMedicoComponent,
    //children:[]
  },
  { path:'comisiones',component:ComisionComponent},
  { path:'paciente',component:RegistroComponent},
  { path:'solicitud',component:SolicitudComponent},
  { path:'busqueda/:number',component:BuscarComponent},
  { path:'resultados',component:ResultadosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicoRoutingModule { }
