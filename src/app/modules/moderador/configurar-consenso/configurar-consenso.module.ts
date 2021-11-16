import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurarConsensoRoutingModule } from './configurar-consenso-routing.module';
import { ConfigurarConsensoComponent } from './page/configurar-consenso.component';
import { MaterialModule } from '../../shared/material/material.module';
import { AddItemComponent } from '../components/add-item/add-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddAtributeComponent } from '../components/add-atribute/add-atribute.component';
import { AddParticipantComponent } from '../components/add-participant/add-participant.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChartSimpleModule, ChartsModule, WavesModule } from 'ng-uikit-pro-standard';
import { DialogConfirmacionEstado } from './page/dialogConfirmacionEstado.component';

@NgModule({
  declarations: [ConfigurarConsensoComponent,
    AddItemComponent,
    AddAtributeComponent,
    AddParticipantComponent,
    ConfirmationDialogComponent,
    DialogConfirmacionEstado
  ],
  imports: [
    ChartsModule,
    ChartSimpleModule,
    WavesModule,
    CommonModule,
    ConfigurarConsensoRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxCsvParserModule,
    NgxSpinnerModule,
  ]
})
export class ConfigurarConsensoModule { }
