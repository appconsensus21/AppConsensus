import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdministradorService } from 'src/app/services/administrador.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css', '../../moderadores/page/moderadores.component.css']
})

/**
 * Administrador
 * Controlador de la Página Notificaciones: 
 * - Permite la creación de una notificación para enviar a los diversos usuarios del sistema.
 */

export class NotificacionesComponent implements OnInit {

  constructor(
    public _formBuilder: FormBuilder,
    public _servicioAdmin: AdministradorService,
  ) { }

  ngOnInit(): void {
  }

  public notificationForm = this._formBuilder.group({
    sendto: ['', [Validators.required]],
    asunto: ['', [Validators.required]],
    message: ['', [Validators.required]]
  });

  public _limpiarFormulario() {
    this.notificationForm.reset();
  }

  async _enviarFormulario() {
    if (this.notificationForm.valid) {
      if (this.notificationForm.get('sendto')?.value == 'moderador') {
        await this._servicioAdmin._enviarNotificacionAModeradores(
          this.notificationForm.get('asunto')?.value,
          this.notificationForm.get('message')?.value);
      }
      else if (this.notificationForm.get('sendto')?.value == 'participante') {
        await this._servicioAdmin._enviarNotificacionAParticipantes(
          this.notificationForm.get('asunto')?.value,
          this.notificationForm.get('message')?.value);
      }
      else {
        await this._servicioAdmin._enviarNotificacionTodos(
          this.notificationForm.get('asunto')?.value,
          this.notificationForm.get('message')?.value);
      }
      this.notificationForm.reset();
    }

  }
}
