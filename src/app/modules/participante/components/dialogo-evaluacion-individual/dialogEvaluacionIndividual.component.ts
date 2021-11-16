import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs/operators";
import { EvaluacionService } from "src/app/services/evaluacion.service";
import { ParticipanteService } from '../../../../services/participante.service';
import { element } from 'protractor';
import { ConsensoServiceService } from "src/app/services/consenso-service.service";
import { ResumenEvaluacion } from '../../../../interfaces/resumen-evaluacion';

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialogEvaluacionIndividual.component.html',
})
export class DialogEvaluacionIndividual {

  public displayedColumns: string[] = ['item', 'aceptacion', 'rechazo'];
  public dataSource: any;
  public resumenEvaluacion: ResumenEvaluacion[] = [];
  public participantes: any[] = [];
  public participantestotal: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogEvaluacionIndividual>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _servicioNotificacion: ToastrService,
    private _servicioParticipante: ParticipanteService,
    private _servicioEvaluacion: EvaluacionService,
    private _servicioConsenso: ConsensoServiceService,
    private router: Router,
  ) {
  }

  async ngOnInit() {
    for (let item of this.data.element.item) {
      let add = {
        nombreItem: '',
        aceptacion: `${item.valorAceptacion} `,
        rechazo: `${item.valorRechazo} `
      }
      let name = this._servicioConsenso._recuperarItem(item.idItem).pipe(take(1)).toPromise();
      await name.then((value: any) => {
        add.nombreItem = value.data()['nombre'];
        item.arrayAceptacion.forEach((atracep: any) => {
          this._servicioConsenso._recuperarAtributoporId(atracep).pipe(take(1)).toPromise().then((res: any) => {
            add.aceptacion += " " + res.data().atributo + ","
          })
        });
        item.arrayRechazo.forEach((atracep: any) => {
          this._servicioConsenso._recuperarAtributoporId(atracep).pipe(take(1)).toPromise().then((res: any) => {
            add.rechazo += " " + res.data().atributo + ","
          })
        });
      });
      this.resumenEvaluacion.push(add)
    }
    this.dataSource = this.resumenEvaluacion;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  //Enviar evaluacion individual
  async onYesClick(): Promise<void> {
    await this._servicioParticipante._registrarEvaluacionParticipante(this.data.element.idRonda, this.data.element.idParticipante); //
    await this.gettotalParticipantesRonda(this.data.element.idRonda);
    await this._servicioEvaluacion._crearEvaluacionIndividual(this.data.element).finally(async () => {
      if (this.data.totalparticipantes == this.participantestotal.length) {
        await this._servicioEvaluacion._algoritmoFASTCR(this.data.element.idConsenso,
          this.data.element.idRonda, this.data.nivel, this.data.ronda == this.data.rondas, this.data.ronda).then(() => {
          });
        this._servicioParticipante._finalizarRonda(this.data.element.idRonda).catch(() => {
          this._servicioNotificacion.error('Ha ocurrido un error al finalizar la ronda')
        });
        if (this.data.ronda == this.data.rondas) {
          this._servicioConsenso._actualizarEstadoConsenso(this.data.element.idConsenso, 'finalizado')
        }
      }
      this._servicioNotificacion.success('Evaluación completada con éxito', 'Enviado');
      this.router.navigate(['/appParticipante/listaConsensos']);
    });
    this.dialogRef.close();
  }

  async gettotalParticipantesRonda(id: any) {
    const ronda = this._servicioParticipante._recuperarRondaporId(id).pipe(take(1)).toPromise();
    await ronda.then((round: any) => {
      this.participantestotal = round.data()['participantes'];
    })
  }

}