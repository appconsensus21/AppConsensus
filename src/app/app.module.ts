import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApplayoutComponent } from './layouts/applayout/applayout.component';
import { AuthenticationLayoutComponent } from './layouts/authentication-layout/authentication-layout.component';
import { CoreModule } from './modules/shared/core/core.module';
import { MaterialModule } from './modules/shared/material/material.module';
// import { LoginModule } from './modules/login/login.module'
import { SharedModule } from './modules/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConsensosModule } from './modules/administrador/consensos/consensos.module';
import { ModeradoresModule } from './modules/administrador/moderadores/moderadores.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApplayoutAdminComponent } from './layouts/applayout-admin/applayout-admin.component';
import { ApplayoutModComponent } from './layouts/applayout-mod/applayout-mod.component';
import { ApplayoutPartComponent } from './layouts/applayout-part/applayout-part.component';
import { FooterComponent } from './components/footer/footer.component';
import { ConfirmationDialogLogoutComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { GuardComponent } from './guards/guard.component';
import { GuardParticipanteComponent } from './guards/guardParticipante.component';
import { GuardModeradorComponent } from './guards/guardModerador.component';
@NgModule({
  declarations: [
    AppComponent,
    ApplayoutComponent,
    AuthenticationLayoutComponent,
    ApplayoutAdminComponent,
    ApplayoutModComponent,
    ApplayoutPartComponent,
    ConfirmationDialogLogoutComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    SharedModule,
    MaterialModule,
    // LoginModule,
    CoreModule,
    BrowserAnimationsModule,
    ConsensosModule,
    ModeradoresModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
  ],
  exports: [
    MatFormFieldModule,
  ],
  entryComponents:[
    ConfirmationDialogLogoutComponent
  ],
  providers: [
    GuardComponent,
    GuardParticipanteComponent,
    GuardModeradorComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
