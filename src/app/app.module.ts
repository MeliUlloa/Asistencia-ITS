import { NgModule } from '@angular/core'; // Importaciones principales de Angular
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'; // Importaciones de Ionic para la estructura de la app
import { AppComponent } from './app.component'; // Componente principal de la aplicación
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service';
import { AngularFireModule } from '@angular/fire/compat'; // Importaciones de Firebase usando los módulos compat
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';// Importación del archivo de configuración de Firebase

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  // Declaración de componentes propios del módulo
  declarations: [AppComponent],

  // Módulos que se importan para que funcionen las diferentes funcionalidades
  imports: [
    BrowserModule, // Necesario para aplicaciones web
    IonicModule.forRoot(), // Inicializa Ionic
    AppRoutingModule,

    AngularFireModule.initializeApp(environment.firebaseConfig), // Inicializa Firebase con la configuración
    AngularFireAuthModule, // Habilita la autenticación con Firebase
    AngularFirestoreModule, // Habilita el uso de Firestore (base de datos)
    
    ReactiveFormsModule
  ],

  // Proveedores de servicios y configuraciones
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, // Estrategia de enrutamiento para Ionic
    AuthService // Servicio personalizado para manejar la autenticación
  ],

  // Componente raíz que se inicializa al arrancar la app
  bootstrap: [AppComponent]
})
export class AppModule { }



