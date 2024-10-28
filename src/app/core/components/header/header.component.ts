import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStatus, User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private authService = inject(AuthService);

  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['']);
  }

  goToPatient() {
    this.router.navigate(['paciente']);
  }

  goToMedico() {
    this.router.navigate(['medico']);
  }

  goToLab() {
    this.router.navigate(['laboratorista']);
  }

  goToReception() {
    this.router.navigate(['recepcion']);
  }

  goToAdmin() {
    this.router.navigate(['admin']);
  }

  public patientAuthCheck = computed<boolean>( () =>{
    if (this.authService.authStatus() === AuthStatus.authenticated){
      if (this.authService.currentUser()?.roles==='paciente'){
        return true;
      }
    }
    return false;
  });

  public medicoAuthCheck = computed<boolean>( () =>{
    if (this.authService.authStatus() === AuthStatus.authenticated){
      if (this.authService.currentUser()?.roles==='medico'){
        return true;
      }
    }
    return false;
  });

  public labAuthCheck = computed<boolean>( () =>{
    if (this.authService.authStatus() === AuthStatus.authenticated){
      if (this.authService.currentUser()?.roles==='laboratorista'){
        return true;
      }
    }
    return false;
  });

  public receptionAuthCheck = computed<boolean>( () =>{
    if (this.authService.authStatus() === AuthStatus.authenticated){
      if (this.authService.currentUser()?.roles==='recepcion'){
        return true;
      }
    }
    return false;
  });

  public adminAuthCheck = computed<boolean>( () =>{
    if (this.authService.authStatus() === AuthStatus.authenticated){
      if (this.authService.currentUser()?.roles==='admin'){
        return true;
      }
    }
    return false;
  });

  onLogout(){
    this.authService.logout();
  }
}
