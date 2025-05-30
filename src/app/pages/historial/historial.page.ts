import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { RegistroAsistencia } from 'src/app/models/asistencia.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { User } from 'firebase/auth'; // Interfaz de usuario de Firebase

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false,
})

export class HistorialPage implements OnInit {

  registros: RegistroAsistencia[] = [];  // Aquí se guardas los registros para mostrar
  constructor(
    private asistenciaService: AsistenciaService,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    // Obtenemos usuario actual
    const user = await this.authService.currentUser;
    console.log('UID:', user?.uid);
    console.log('Registros:', this.registros);

    if (!user) return; // Si no hay usuario, no hacemos nada

    // Traemos historial desde Firestore
    this.registros = await this.asistenciaService.getHistorial(user.uid);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

}
