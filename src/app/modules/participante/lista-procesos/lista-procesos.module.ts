import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaProcesosRoutingModule } from './lista-procesos-routing.module';
import { ListaProcesosComponent } from './page/lista-procesos.component';
import { MaterialModule } from '../../shared/material/material.module';
import { IngresoProcesoComponent } from '../components/ingreso-proceso/ingreso-proceso.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListaProcesosComponent, 
    IngresoProcesoComponent,
  ],
  imports: [
    CommonModule,
    ListaProcesosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class ListaProcesosModule { }
