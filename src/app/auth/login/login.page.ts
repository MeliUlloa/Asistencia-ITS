import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})

export class LoginPage {
  // Formulario reactivo y con validaciones
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public navCtrl: NavController
  ) {}

  // Metodo que se llama al enviar el formulario
  async login() {
    const { email, password } = this.form.value;

    if (!this.form.valid) {
      console.log('Formulario no valido');
      return;
    }

    try {
      await this.authService.login(email!, password!);
      this.navCtrl.navigateRoot('/home');
    } catch (error) {
      console.error('Error al Iniciar Sesión', error);
    }
  }
}
