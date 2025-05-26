export function isInWorkZone( // Esta función usa la fórmula de Haversine, que calcula la distancia entre dos puntos en el globo terrestre (considerando la curvatura de la Tierra 🌍).
  current: { lat: number; lng: number }, // posición actual (latitud y longitud).
  center: { lat: number; lng: number }, // centro de la zona permitida (por ejemplo, la escuela).
  radiusInMeters: number, // es el radio máximo de distancia aceptado
): boolean { // true si estás dentro del radio, false si estás fuera.
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371e3; // radio de la Tierra en metros

  const dLat = toRad(center.lat - current.lat);
  const dLng = toRad(center.lng - current.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(current.lat)) *
    Math.cos(toRad(center.lat)) *
    Math.sin(dLng / 2) ** 2;
// Calculamos el ángulo central entre los dos puntos
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// Distancia total entre los puntos en metros
  const distance = R * c;
// Devuelve true si la distancia está dentro del radio permitido
  return distance <= radiusInMeters;
}
