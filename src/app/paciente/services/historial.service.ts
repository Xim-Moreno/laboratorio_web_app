import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  historiales: any[] = [];
  selectedHistorial: string = '';

  // Método para actualizar los historiales
  setHistoriales(data: any[]) {
    this.historiales = data;
  }
  // Método para definir el historial actual
  setSelectedHistorial(data: string) {
    this.selectedHistorial = data;
  }

  // Método para obtener los historiales actuales
  getHistoriales() {
    return this.historiales;
  }

  // Método para obtener el historial seleccionado
  getSelectedHistorial() {
    return this.selectedHistorial;
  }
}
