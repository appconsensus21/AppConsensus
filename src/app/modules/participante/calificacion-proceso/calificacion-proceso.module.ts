import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalificacionProcesoRoutingModule } from './calificacion-proceso-routing.module';
import { CalificacionProcesoComponent } from './page/calificacion-proceso.component';
import { MaterialModule } from '../../shared/material/material.module';
import { DialogEvaluacionIndividual } from '../components/dialogo-evaluacion-individual/dialogEvaluacionIndividual.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CalificacionProcesoComponent, DialogEvaluacionIndividual],
  imports: [
    CommonModule,
    CalificacionProcesoRoutingModule,
    MaterialModule,
    FormsModule
  ]
})
export class CalificacionProcesoModule { }
