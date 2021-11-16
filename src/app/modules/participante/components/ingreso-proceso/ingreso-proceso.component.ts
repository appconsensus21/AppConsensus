import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsensoServiceService } from '../../../../services/consenso-service.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-ingreso-proceso',
  templateUrl: './ingreso-proceso.component.html',
  styleUrls: ['./ingreso-proceso.component.css']
})
export class IngresoProcesoComponent implements OnInit {

  constructor(
    public _formBuilder: FormBuilder,
    private _servicioConsenso: ConsensoServiceService,
    private _servicioNotificacion: ToastrService,
    private dialogRef: MatDialogRef<IngresoProcesoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  async ngOnInit() {}

  codeForm = this._formBuilder.group({
    code: ['', [Validators.required]],
  });

  public close() {
    this.dialogRef.close({ agg: false })
  }

  public async _ingresarConsenso() {
    let recargar = false;
    await this._servicioConsenso._recuperarConsensoporCodigo(this.codeForm.get('code')?.value, this.data.iduser).pipe(take(1)).toPromise()
      .then((consenso: any) => {
        if(consenso.length == 0){
          this._servicioNotificacion.warning('El código proporcionado no existe en el sistema o no se encuentra agregado a este proceso de consenso');
          recargar = false;
          this.dialogRef.close({ agg: recargar })
        }else{
          consenso.map((e: any) => {
            const data = e.payload.doc.data() as any;
            const id = e.payload.doc.id;
              if (!data.aceptado) {
                this._servicioConsenso._actualizarRegistro(id).then(()=>{
                  this._servicioNotificacion.success('Proceso de consenso agregado con éxito')
                  recargar = true;
                  this.dialogRef.close({ agg: recargar })
                }).catch(() => {
                  this._servicioNotificacion.warning('Ha ocurrido un error en el sistema');
                });
              }else{
                this._servicioNotificacion.warning('Ya se encuentra agregado a este proceso de consenso');
                recargar = false
                this.dialogRef.close({ agg: recargar })
              }
          })
        }
      })
  }
}
