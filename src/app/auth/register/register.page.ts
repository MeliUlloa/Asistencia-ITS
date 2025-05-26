import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false
})

export class RegisterPage {

  // Formulario reactivo con validaciones
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public navCtrl: NavController
  ) {}

  // Método que se llama al enviar el formulario
  async register() {
    const { email, password } = this.form.value;

    if (!this.form.valid) {
      console.log('Formulario inválido');
      return;
    }

    try {
      await this.authService.register(email!, password!);
      this.navCtrl.navigateRoot('/home'); // Redirige al home tras el registro
    } catch (error) {
      console.error('Error al registrar', error);
    }
  }
}
