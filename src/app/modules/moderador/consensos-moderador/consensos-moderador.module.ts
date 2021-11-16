import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConsensosModeradorRoutingModule } from './consensos-moderador-routing.module';
import { ConsensosModeradorComponent } from './page/consensos-moderador.component';
import { MaterialModule } from '../../shared/material/material.module';


@NgModule({
  declarations: [ConsensosModeradorComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ConsensosModeradorRoutingModule,
    NgxSpinnerModule,
  ]
})
export class ConsensosModeradorModule { }
