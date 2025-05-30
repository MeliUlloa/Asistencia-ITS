import { Injectable, EnvironmentInjector, runInInjectionContext } from '@angular/core';
// Importamos EnvironmentInjector y runInInjectionContext para ejecutar código dentro del contexto de inyección Angular.

import { RegistroAsistencia } from '../models/asistencia.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs'; // Para convertir Observable en Promise

@Injectable({
  providedIn: 'root'

})

export class AsistenciaService {

  // Inyectamos AngularFirestore para usar Firestore y EnvironmentInjector para inyección segura de dependencias
  constructor(
    private firestore: AngularFirestore,
    private injector: EnvironmentInjector
  ) { }

  // Método para registrar un nuevo documento de asistencia en Firestore
  async registrar(asistencia: RegistroAsistencia) {
    // ENVUELVE la lógica en runInInjectionContext
    return runInInjectionContext(this.injector, async () => {
      // La llamada a collection() ahora está DENTRO del contexto --> ESTE ERA EL ERROR QUE NO ME DEJABA REGISTRAR.
      return await this.firestore.collection('registros').add(asistencia);
    });
  }


  // Método que verifica si el usuario ya registró entrada o salida ese día
  async yaRegistro(uid: string, fecha: string, tipo: 'entrada' | 'salida'): Promise<boolean> {
    // Usamos runInInjectionContext para que este bloque tenga el contexto de inyección Angular necesario
    return runInInjectionContext(this.injector, async () => {
      // Construimos la consulta a Firestore filtrando por uid, fecha y tipo de registro
      const collection = this.firestore.collection<RegistroAsistencia>('registros', ref =>
        ref
          .where('uid', '==', uid)
          .where('fecha', '==', fecha)
          .where('tipo', '==', tipo)
      );

      // Obtenemos los registros que coinciden como un array, usando firstValueFrom para convertir Observable a Promise
      const registros = await firstValueFrom(collection.valueChanges());

      // Si existe al menos un registro, devolvemos true
      return registros.length > 0;
    });
  }

  // Método para obtener el historial completo de registros de un usuario
  async getHistorial(uid: string): Promise<RegistroAsistencia[]> {
    // Ejecutamos esta función dentro del contexto de inyección para evitar el error NG0203
    return runInInjectionContext(this.injector, async () => {
      // Creamos la referencia a la colección filtrada por uid y ordenada por fecha descendente
      const ref = this.firestore.collection<RegistroAsistencia>('registros', ref =>
        ref
          .where('uid', '==', uid)
          .orderBy('fecha', 'desc')
      );

      // Obtenemos los cambios de snapshot (documentos + metadata)
      const snapshot = await firstValueFrom(ref.snapshotChanges());

      // Mapeamos cada acción para extraer id y datos de cada documento
      return snapshot.map(action => {
        const data = action.payload.doc.data() as RegistroAsistencia;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
  }
}

