import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsensosRoutingModule } from './consensos-routing.module';
import { ConsensoComponent } from './page/consenso.component';
import { MaterialModule } from '../../shared/material/material.module';


@NgModule({
  declarations: [ConsensoComponent],
  imports: [
    CommonModule,
    ConsensosRoutingModule,
    MaterialModule
  ]
})
export class ConsensosModule { }
