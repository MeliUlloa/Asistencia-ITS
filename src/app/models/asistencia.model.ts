// Modelo para tipar cada registro que guarda en Firestore, esto ayuda a controlar bien la información que necesitamos guardar.
export interface RegistroAsistencia {
  uid: string;                   // ID único del usuario que registra la asistencia
  tipo: 'entrada' | 'salida';   // Tipo de registro: si es entrada o salida
  fecha: string;                // Fecha y hora del registro en formato ISO (por ejemplo: "2025-05-26T14:00:00Z")
  ubicacion: {                  // Objeto con las coordenadas geográficas donde se hizo el registro
    lat: number;                // Latitud
    lng: number;                // Longitud
  };
  fotoBase64: string;           // Foto tomada convertida a cadena base64 para almacenar en Firestore
}

