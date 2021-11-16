import { Component, OnInit, Inject } from '@angular/core';
import { ConsensoServiceService } from '../../../../services/consenso-service.service';
import { UtilidadServiceService } from '../../../../services/utilidad-service.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add-atribute',
  templateUrl: './add-atribute.component.html',
  styleUrls: ['./add-atribute.component.css']
})
export class AddAtributeComponent implements OnInit {
  idAtributo: any;
  noexiste = true;
  constructor(
    public _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddAtributeComponent>,
    private _servicioNotificacion: ToastrService,
    public _servicioUtilidad: UtilidadServiceService,
    public _servicioConsenso: ConsensoServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  atributoForm = this._formBuilder.group({
    atributo: ['', [Validators.required]],
    valor: ['', [Validators.required]]
  })

  public close() {
    this.dialogRef.close()
  }

  public async addatributo() {
    const recordAttribute = {
      atributo: this.atributoForm.get('atributo')?.value,
      valor: this.atributoForm.get('valor')?.value,
      id_proceso_consenso: this.data.id_consenso
    }
    if (this.data.tipo != undefined) {
      if (this.data.tipo === 'aceptacion') {
        await this.verificarAtributo(this.data.atraceptacion, recordAttribute)
      } else {
        await this.verificarAtributo(this.data.atrrechazo, recordAttribute)
      }
      if (this.noexiste) {
        await this._servicioConsenso
          ._crearAtributo(recordAttribute)
          .then((result) => {
            this.idAtributo = result.id;
            this._servicioNotificacion.success('Atributo agregado', '¡Éxito!');
          }).catch((err) => {
            this._servicioNotificacion.error('Error al agregar atributo');
          });
        this.dialogRef.close({ atributo: recordAttribute.atributo, valor: recordAttribute.valor, id: this.idAtributo });
      } else {
        this.dialogRef.close();
      }
    } else {
      recordAttribute.atributo = recordAttribute.atributo.charAt(0).toUpperCase() + recordAttribute.atributo.slice(1).toLowerCase();
      await this._servicioConsenso._recuperarAtributoporNombre(recordAttribute.atributo).pipe(take(1)).toPromise()
        .then(async (respuesta: any) => {
          if (respuesta.length > 0) {
            this._servicioNotificacion.error('Error al agregar atributo, el atributo ya existe');
            this.dialogRef.close();
          } else {
            await this._servicioConsenso
              ._crearAtributo(recordAttribute)
              .then((result) => {
                this.idAtributo = result.id;
                this._servicioNotificacion.success('Atributo agregado', '¡Éxito!');
              }).catch((err) => {
                this._servicioNotificacion.error('Error al agregar atributo');
              });
            this.dialogRef.close({ atributo: recordAttribute.atributo, valor: recordAttribute.valor, id: this.idAtributo });
          }
        });
    }
  }

  private async verificarAtributo(array: any[], result: any) {
    if (array.length == 0) {
      ///
    } else {
      array.forEach((element: any) => {
        if (this.compare(element.atributo as string, result.atributo as string)
        ) {
          this.noexiste = false;
          this._servicioNotificacion.info('Este atributo ya existe');
        }
      });
    }
  }

  private compare(text1: string, text2: string) {
    return text1.toUpperCase() === text2.toUpperCase();
  }
}
