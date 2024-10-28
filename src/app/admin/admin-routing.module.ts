import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './layouts/dashboard-admin/dashboard-admin.component';
import { RegPacienteComponent } from './layouts/reg-paciente/reg-paciente.component';
import { RegMedicoComponent } from './layouts/reg-medico/reg-medico.component';
import { RegLabComponent } from './layouts/reg-lab/reg-lab.component';


const routes: Routes = [
  {
    path:'',component:DashboardAdminComponent,
    //children:[]
  },
  {path:'registro-paciente',component:RegPacienteComponent},
  {path:'registro-medico',component:RegMedicoComponent},
  {path:'registro-lab',component:RegLabComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
