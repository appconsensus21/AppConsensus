import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultadosRoutingModule } from './resultados-routing.module';
import { ResultadosComponent } from './page/resultados.component';
import { MaterialModule } from '../../shared/material/material.module';
import { ChartsModule, ChartSimpleModule, WavesModule } from 'ng-uikit-pro-standard'

@NgModule({
  declarations: [ResultadosComponent],
  imports: [
    CommonModule,
    ResultadosRoutingModule,
    MaterialModule,
    ChartsModule,
    ChartSimpleModule,
    WavesModule,
  ]
})
export class ResultadosModule { }
