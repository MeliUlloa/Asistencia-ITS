import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { isInWorkZone } from '../utils/geo.util';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface Student {
  firstName: string;
  lastName: string;
  avatar: string;
  present: boolean;
  id?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  public actionSheetButtons = [
    {
      text: 'Ausente',
      role: 'destructive',
      data: {
        action: 'delete'
      },
      icon: 'trash',
    },
    {
      text: 'Presente',
      role: 'present',
      data: {
        action: 'present'
      },
      icon: 'checkmark',
    },
    {
      text: 'Tarde',
      role: 'late',
      data: {
        action: 'late'
      },
      icon: 'time',
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      icon: 'close',
      data: {
        action: 'cancel'
      }
    }
  ]

  students: Student[] = [
    { firstName: 'Juan', lastName: 'Pérez', avatar: 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg', present: false },
    { firstName: 'María', lastName: 'García', avatar: 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg', present: false },
    { firstName: 'Carlos', lastName: 'Ramírez', avatar: 'https://img.freepik.com/free-vector/smiling-redhaired-cartoon-boy_1308-174709.jpg?semt=ais_hybrid', present: false },
    { firstName: 'Ana', lastName: 'Sánchez', avatar: 'https://img.freepik.com/free-vector/blonde-boy-blue-hoodie_1308-175828.jpg', present: false },
  ];

  constructor() { }

  // Obtener geolocalización

  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();

      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      console.log('Ubicación actual:', coords);
      return coords;
    } catch (err) {
      console.error('Error obteniendo ubicación:', err);
      return null;
    }
  }

  // Validacion si esta dentro de zona permitida

  async validarZonaTrabajo() {
    const current = await this.getCurrentLocation();

    const zonaTrabajo = {
      lat: -38.928386106979964,   // Latitud de ITS
      lng: -67.97382072905697    // Longitud de ITS
    };

    const dentroZona = isInWorkZone(current!, zonaTrabajo, 100); // 100 metros

    if (dentroZona) {
      console.log('✅ Estás dentro de la zona de trabajo');
    } else {
      console.warn('❌ Estás fuera de la zona permitida');
    }
  }

  // Capturar imagen con camara
  async takePhoto(): Promise<string | null> {
    try {
      // Llama a la cámara del dispositivo
      const image = await Camera.getPhoto({
        quality: 70, // Calidad de la imagen (0 a 100)
        resultType: CameraResultType.Base64, // Devolver como base64 para guardarlo fácil en Firebase
        source: CameraSource.Camera // Fuente: directamente la cámara
      });

      // Devuelve el string base64 de la imagen tomada
      return image.base64String!;
    } catch (error) {
      // Si hay un error (el usuario cancela, o no da permisos)
      console.error('Error al tomar la foto:', error);
      return null;
    }
  }

  // testeo de foto tomada
  async probarCamara() {
  const foto = await this.takePhoto();
  if (foto) {
    console.log('📷 Imagen capturada:', foto);
    // Podés mostrarla en pantalla si querés
  } else {
    console.warn('No se tomó ninguna foto');
  }
}

  guardarAsistencia() {
    console.log('Asistencia guardada:', this.students);
  }

}
