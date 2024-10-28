import { Router } from '@angular/router';
import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'laboratorio_web_app';

  private authService = inject(AuthService);
  private router = inject(Router);

  public finishedAuthCheck = computed<boolean>( () =>{
    if (this.authService.authStatus() === AuthStatus.checking){
      return false;
    }
    return true;
  });

  public authStatusChangedEffect = effect(() => {
    switch(this.authService.authStatus()){
      case AuthStatus.checking:
        return;
      case AuthStatus.authenticated:
        if(this.authService.currentUser()?.roles=='paciente'){
          this.router.navigateByUrl('paciente');
        }
        else if(this.authService.currentUser()?.roles=='medico'){
          this.router.navigateByUrl('medico');
        }
        else if(this.authService.currentUser()?.roles=='laboratorista'){
          this.router.navigateByUrl('laboratorista');
        }
        else if(this.authService.currentUser()?.roles=='recepcion'){
          this.router.navigateByUrl('recepcion');
        }
        else if(this.authService.currentUser()?.roles=='admin'){
          this.router.navigateByUrl('admin');
        }
        return;
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('auth/login');
        return;
    }
  });
}
