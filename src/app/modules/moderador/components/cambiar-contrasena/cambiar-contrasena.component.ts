import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModeradorService } from '../../../../services/moderador.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from '../../../../validators/custom-validators';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent implements OnInit {

  public hide = true;
  public hidec = true;
  public matcher = new MyErrorStateMatcher();

  constructor(
    public _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CambiarContrasenaComponent>,
    public _servicioModerador: ModeradorService,
    private _servicioUsuario: UsuarioService,
    private _servicioNotificacion: ToastrService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) { }
  

  ngOnInit(): void {
  }

  private checkPasswords(group: FormGroup){ 
    return group.controls.password.value === 
    group.controls.passwordc.value  ? null : { notSame: true }
  }

  changepass =  this._formBuilder.group({
    password: ['',
    Validators.compose([
      Validators.required,
      CustomValidators.patternValidator(/\d/, { hasNumber: true }),
      CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      Validators.minLength(8)
    ]),
  ],
    passwordc: [null, Validators.compose([Validators.required])],
  },{ validators: this.checkPasswords });

  public getErrorMessage() {
    if (this.changepass.get('password')?.hasError('required')) {
      return 'Este campo es requerido';
    }else if(this.changepass.get('password')?.hasError('hasNumber')){
      return 'La contraseña debe tener al menos un número'
    } else if(this.changepass.get('password')?.hasError('hasCapitalCase')){
      return 'La contraseña debe tener al menos una letra mayúscula'
    }else if(this.changepass.get('password')?.hasError('minlength')){
      return 'La contraseña debe tener al menos 8 caracteres'
    }else if(this.changepass.get('password')?.hasError('passwordMatchValidator')){
      return 'Las contraseñas debe no coinciden'
    }

    return this.changepass.get('password')?.hasError('hasSmallCase') ? 'La contraseña debe tener al menos una letra minúscula' : '';

  }

  public async onSubmit(){
    let change = false; //If I need update password
    await this._servicioUsuario._actualizarPswd(this.changepass.get('password')?.value).then((res:any)=>{
      this._servicioUsuario._actualizarUsuario().then(()=>{
        this._servicioNotificacion.success('Contraseña cambiada con éxito');
      }).catch(()=>{
        this._servicioNotificacion.error('Ha ocurrido un error');
      });
    }).catch((err)=>{
      change = true;
      this._servicioNotificacion.error('Vuelva a iniciar sesion','No se pudo actualizar')
    });
    this.dialogRef.close(change);
  }

  public async close(){
    this.dialogRef.close(true);
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);
    return invalidCtrl || invalidParent;
  }
}
