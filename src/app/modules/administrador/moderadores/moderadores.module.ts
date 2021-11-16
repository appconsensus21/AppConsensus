import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModeradoresRoutingModule } from './moderadores-routing.module';
import { ModeradoresComponent } from './page/moderadores.component';
import { MaterialModule } from '../../shared/material/material.module';
import { MatTableModule } from '@angular/material/table' 
import { InvitacionAModeradorComponent } from '../components/invitacion-amoderador/invitacion-amoderador.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModeradoresComponent, InvitacionAModeradorComponent],
  imports: [
    CommonModule,
    ModeradoresRoutingModule,
    MaterialModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  exports:[
    InvitacionAModeradorComponent
  ]
})
export class ModeradoresModule { }
