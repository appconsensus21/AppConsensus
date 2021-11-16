import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public errorMessage = '';
  public form!: FormGroup;
  public hide = true;
  public showSpinner = false;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private firebase: AngularFirestore,
    private ngZone: NgZone,
    private _angularFireauth: AngularFireAuth,
    private _servicioNotificacion: ToastrService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  public login() {
    this.showSpinner = true;
    this._angularFireauth.signInWithEmailAndPassword(this.form.get('username')?.value, this.form.get('password')?.value).then((result) => {
      this.firebase.firestore.collection("usuario").where("uid", "==", result.user?.uid).onSnapshot(snap => {
        snap.forEach(userref => {
          if (userref.data().rol === 'administrador') {
            this.ngZone.run(() => {
              this.router.navigate(['/appAdmin']);
            })
          } else if (userref.data().rol === 'moderador') {
            this.ngZone.run(() => {
              this.router.navigate(['/appModerador']);
            })

          } else if (userref.data().rol === 'participante') {
            this.ngZone.run(() => {
              this.router.navigate(['/appParticipante']);
            })
          }
        })
      })
      this._servicioNotificacion.success('Sesión iniciada exitosamente', '¡Bienvenido!');
    }).catch((response: { message: string; }) => {
      this._servicioNotificacion.error(response.message, '¡Error!');
      this.errorMessage = response.message;
      this.showSpinner = false;
    });
  }

}
