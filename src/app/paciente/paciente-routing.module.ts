import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPacienteComponent } from './layouts/dashboard-paciente/dashboard-paciente.component';
import { SolicitudComponent } from './layouts/solicitud/solicitud.component';
import { ResultadosComponent } from './layouts/resultados/resultados.component';

const routes: Routes = [
  {
    path:'',component:DashboardPacienteComponent,
    //children:[]
  },
  {path:'solicitud-cita', component:SolicitudComponent},
  {path: 'resultados', component: ResultadosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }
