import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  let isAuthenticated = false;
  if (token) {
    isAuthenticated = true;
  }

  // Si no hay token, redirigimos al Login. 
  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }
  // Si hay, permitimos el acceso.
  return true;
};


// Investigar un guard para rutas de Firebase 