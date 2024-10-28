import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPacientComponent } from './pages/login/login-pacient/login-pacient.component';
import { LoginDoctorComponent } from './pages/login/login-doctor/login-doctor.component';
import { LoginLabComponent } from './pages/login/login-lab/login-lab.component';
import { LoginReceptionComponent } from './pages/login/login-reception/login-reception.component';
import { LoginAdminComponent } from './pages/login/login-admin/login-admin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardPacientComponent } from './pages/pacient/dashboard-pacient/dashboard-pacient.component';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-authenticated.guard';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'paciente',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./paciente/paciente.module').then(m => m.PacienteModule),
  },
  {
    path: 'medico',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./medico/medico.module').then(m => m.MedicoModule),
  },
  {
    path: 'laboratorista',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./laboratorista/laboratorista.module').then(m => m.LaboratoristaModule),
  },
  {
    path: 'recepcion',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./recepcion/recepcion.module').then(m => m.RecepcionModule),
  },
  {
    path: 'admin',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: '**',
    component: HomeComponent
  },
  /*{ path: "", component: HomeComponent},
  { path: "login/paciente", component: LoginPacientComponent},
  { path: "login/medico", component: LoginDoctorComponent},
  { path: "login/laboratorio", component: LoginLabComponent},
  { path: "login/recepcion", component: LoginReceptionComponent},
  { path: "login/admin", component: LoginAdminComponent},
  { path: "signup", component: SignupComponent },
  { path: "paciente", component:DashboardPacientComponent}*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
