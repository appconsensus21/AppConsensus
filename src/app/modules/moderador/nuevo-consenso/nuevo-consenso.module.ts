import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NuevoConsensoRoutingModule } from './nuevo-consenso-routing.module';
import { NuevoConsensoComponent } from './page/nuevo-consenso.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { MaterialModule } from '../../shared/material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [NuevoConsensoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    NuevoConsensoRoutingModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxSpinnerModule,
  ]
})
export class NuevoConsensoModule { }
