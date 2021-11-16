import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificacionesRoutingModule } from './notificaciones-routing.module';
import { NotificacionesComponent } from './page/notificaciones.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';


@NgModule({
  declarations: [NotificacionesComponent],
  imports: [
    CommonModule,
    NotificacionesRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class NotificacionesModule { }
