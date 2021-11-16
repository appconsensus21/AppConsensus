import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignInRoutingModule } from './sign-in-routing.module';
import { SignInComponent } from './page/sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { MaterialModule } from '../../shared/material/material.module';

@NgModule({
  declarations: [SignInComponent, LoadingSpinnerComponent],
  imports: [
    CommonModule,
    SignInRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class SignInModule { }
