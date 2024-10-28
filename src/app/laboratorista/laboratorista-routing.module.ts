import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLaboratoristaComponent } from './layouts/dashboard-laboratorista/dashboard-laboratorista.component';
import { BuscarComponent } from './layouts/buscar/buscar.component';
import { ExamenComponent } from './layouts/examen/examen.component';
import { ResultadosComponent } from './layouts/resultados/resultados.component';
import { HttpClientModule } from '@angular/common/http';
import { VerResultadosComponent } from './layouts/ver-resultados/ver-resultados.component';
import { InformeComponent } from './layouts/informe/informe.component';


const routes: Routes = [
  {
    path:'',
    component:DashboardLaboratoristaComponent,
    //children:[]
  },
  { path:'busqueda/:number',component:BuscarComponent},
  { path:'examen',component:ExamenComponent},
  { path:'resultados',component:ResultadosComponent},
  { path:'ver_resultados',component:VerResultadosComponent},
  { path:'informe',component:InformeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    HttpClientModule,
  ]
})
export class LaboratoristaRoutingModule { }
