import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConsensoServiceService } from "src/app/services/consenso-service.service";

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialogConfirmacionEstado.component.html',
})
/**
 * Moderador
 * Componente de la Página Configurar Consenso: 
 * - Permite actualizar el estado de un proceso de consenso
 */

export class DialogConfirmacionEstado {
  public accion: any;

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmacionEstado>,
    private _servicioConsenso: ConsensoServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.value === 'pausado') {
      this.accion = 'pausar';
    } else if (this.data.value === 'iniciado') {
      this.accion = 'iniciar';
    }
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public onYesClick() {
    this._servicioConsenso._actualizarEstadoConsenso(this.data.idConsenso, this.data.value);
    this.dialogRef.close();
  }
}