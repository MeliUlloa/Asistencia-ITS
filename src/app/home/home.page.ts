import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { isInWorkZone } from '../utils/geo.util';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../auth/auth.service';
import { RegistroAsistencia } from '../models/asistencia.model';
import { AsistenciaService } from '../services/asistencia.service';
import { Router } from '@angular/router';

const ZONA_TRABAJO = {
  lat: -38.937955164447395,   // Latitud de ITS: -38.928386106979964
  lng: -67.98312089016233    // Longitud de ITS: -67.97382072905697  
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage {

  mensajeExito = false;

  constructor(
    private authService: AuthService,
    private asistenciaService: AsistenciaService,
    private router: Router
  ) { }

  // Obtener ubicación actual
  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    } catch (err) {
      console.error('Error obteniendo ubicación:', err);
      return null;
    }
  }

  // Tomar foto
  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 30, // bajamos calidad de imagen.
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
      return image.base64String!;
    } catch (err) {
      console.error('Error al tomar la foto:', err);
      return null;
    }
  }

  //Registrar entrada o salida
  async registrarAsistencia(tipo: 'entrada' | 'salida') {
    console.log('registrarAsistencia called with tipo:', tipo);
    // Esperamos el usuario actual
    const user = await this.authService.currentUser;

    if (!user) return;

    // Obtenemos la fecha sin hora
    const fecha = new Date().toISOString().split('T')[0];
    console.log('Fecha obtenida:', fecha);

    // Validar si ya registró
    console.log('Antes de yaRegistro');
    const ya = await this.asistenciaService.yaRegistro(user.uid, fecha, tipo);
    if (ya) {
      alert(`Ya registraste tu ${tipo} hoy`);
      return;
    }

    // Obtenemos ubicación actual
    const ubicacion = await this.getCurrentLocation();

    // Validamos que se haya obtenido correctamente (no debe ser null)
    if (!ubicacion) {
      alert('No se pudo obtener la ubicación');
      return;
    }

    // validamos si esta dentro de la zona pactada.
    const estaEnZona = isInWorkZone(ubicacion!, ZONA_TRABAJO, 100000); // 100 metros de margen

    if (!estaEnZona) {
      alert('Estás fuera de la zona autorizada');
      return;
    }

    // Tomamos foto
    const foto = await this.takePhoto();
    // validamos si se saco la foto o no
    if (!foto) {
      alert('No se tomó la foto');
      return;
    }

    // objeto para Firestore
    const registro: RegistroAsistencia = {
      uid: user.uid, // id usuario
      tipo,          // entrada o salida
      fecha,         // solo fecha, sin hora
      ubicacion,     //
      fotoBase64: foto,
    };

    // Guardamos registro en Firestore
    await this.asistenciaService.registrar(registro);
    this.mensajeExito = true; // Mostrar mensaje + botón
  }
  // Redirige a historial
  irAlHistorial() {
    this.router.navigate(['/historial']);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}

