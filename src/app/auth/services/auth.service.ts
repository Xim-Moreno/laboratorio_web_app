import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';
import { CitaResponse } from '../interfaces/cita-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(()=> this._currentUser());
  public authStatus = computed(()=> this._authStatus());


  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user:User,token:string):boolean{
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token',token);
    return true;
  }

  login ( number: string, password: string): Observable<LoginResponse>{
    const url = `${this.baseUrl}/auth/login`;
    const body = {number, password};

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => {
        this.setAuthentication(user, token); // No necesitas retornar esto, solo lo ejecutas
        return { user, token }; // Retorna el LoginResponse
      }),
      catchError(err => throwError(() => err.error.message))
    );
  }

  register(number: string, name: string, lastname: string, birth: string, gender: string, phone: string, password: string, roles?:string, especialidad?:string, cedula?:string): Observable<LoginResponse> {
    const url = `${this.baseUrl}/auth/register`;
    const body = { name, lastname, birth, gender, phone, password, roles, especialidad, cedula };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        map(response => response),
        catchError(err => throwError(() => err.error.message))
      );
  }

  registerCita(patient_id: string, analysis: string, doctor_id: string, lab_id: string, date: string, hour: string): Observable<LoginResponse> {
    const url = `${this.baseUrl}/cita/create-cita`; // Cambia la URL según tu configuración
    const muestra = false;
    const body = { patient_id, analysis, doctor_id, lab_id,  date, hour, muestra };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        map(response => response),
        catchError(err => throwError(() => err.error.message))
      );
  }

  checkAuthStatus(): Observable<boolean>{

    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization',`Bearer ${token}`);
      return this.http.get<CheckTokenResponse>(url,{headers})
        .pipe(
          map(({token,user}) =>this.setAuthentication(user,token)),
          catchError(() => {
            this._authStatus.set(AuthStatus.notAuthenticated);
            return of(false);
          })
        )

  }

  logout(){
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }
}
