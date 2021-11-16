import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministradorService } from '../../../../services/administrador.service';

@Component({
  selector: 'app-invitacion-amoderador',
  templateUrl: './invitacion-amoderador.component.html',
  styleUrls: ['./invitacion-amoderador.component.css']
})
export class InvitacionAModeradorComponent implements OnInit {

  constructor(
    public _formBuilder: FormBuilder,
    public _servicioAdmin: AdministradorService,
    private _dialogRef: MatDialogRef<InvitacionAModeradorComponent>,
    @Inject(MAT_DIALOG_DATA) _data: any
  ) { 
  }

  public forminvitation =  this._formBuilder.group({
    username: ['',[ Validators.required]],
    lastname: ['',[ Validators.required]],
    email: ['', [Validators.email, Validators.required]]
  });

  async ngOnInit() {
  }

  async onSubmit(){
    await this._servicioAdmin._agregarModerador(this.forminvitation.get('username')?.value,
    this.forminvitation.get('lastname')?.value, this.forminvitation.get('email')?.value);
    this._dialogRef.close();
  }
}
