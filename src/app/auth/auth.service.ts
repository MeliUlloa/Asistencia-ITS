import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import firebase from 'firebase/compat/app'; // Para usar el tipo firebase.User

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<firebase.User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

    // inyecta el servicio de autenticación de firebase
  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      this.currentUserSubject.next(user);
    });
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }

  // Devuelve el usuario autenticado si es que lo hay.
  get currentUser() {
    return this.afAuth.currentUser;
  }
}


