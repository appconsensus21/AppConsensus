import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluacionProcesoRoutingModule } from './evaluacion-proceso-routing.module';
import { EvaluacionProcesoComponent } from './page/evaluacion-proceso.component';
import { MaterialModule } from '../../shared/material/material.module';


@NgModule({
  declarations: [
    EvaluacionProcesoComponent
  ],
  imports: [
    CommonModule,
    EvaluacionProcesoRoutingModule,
    MaterialModule
  ]
})
export class EvaluacionProcesoModule { }
