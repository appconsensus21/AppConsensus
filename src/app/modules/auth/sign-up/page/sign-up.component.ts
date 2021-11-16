import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../validators/custom-validators';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css', '../../sign-in/page/sign-in.component.css']
})
export class SignUpComponent implements OnInit {

  //Buttons
  public hide = true;
  public hideconfirm = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _servicioUsuario: UsuarioService
  ) { }

  ngOnInit(): void {
  }

  formRegistro = this._formBuilder.group({
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.compose([
      Validators.required,
      CustomValidators.patternValidator(/\d/, { hasNumber: true }),
      CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      Validators.minLength(8)
    ]),
    ],
    confirmPassword: [null, Validators.compose([Validators.required])]
  },
    {
      validator: CustomValidators.passwordMatchValidator
    }
  );

  getErrorMessage() {
    if (this.formRegistro.get('password')?.hasError('required')) {
      return 'Este campo es requerido';
    } else if (this.formRegistro.get('password')?.hasError('hasNumber')) {
      return 'La contraseña debe tener al menos un número'
    } else if (this.formRegistro.get('password')?.hasError('hasCapitalCase')) {
      return 'La contraseña debe tener al menos una letra mayúscula'
    } else if (this.formRegistro.get('password')?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres'
    } else if (this.formRegistro.get('password')?.hasError('passwordMatchValidator')) {
      return 'Las contraseñas debe no coinciden'
    }
    return this.formRegistro.get('password')?.hasError('hasSmallCase') ? 'La contraseña debe tener al menos una letra minúscula' : '';
  }

  registrar() {
    this._servicioUsuario._crearUsuarioParticipante(
      this.formRegistro.get('nombres')?.value,
      this.formRegistro.get('apellidos')?.value,
      this.formRegistro.get('email')?.value,
      this.formRegistro.get('password')?.value,
    )
  }
}
