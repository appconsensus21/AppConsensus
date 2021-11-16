import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConsensoServiceService } from '../../../../services/consenso-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from '../../components/add-item/add-item.component';
import { ModeradorService } from '../../../../services/moderador.service';
import { AddAtributeComponent } from '../../components/add-atribute/add-atribute.component';
import { AddParticipantComponent } from '../../components/add-participant/add-participant.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { NgxSpinnerService } from "ngx-spinner";
import { take } from 'rxjs/operators';
import { element, logging } from 'protractor';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { DialogConfirmacionEstado } from './dialogConfirmacionEstado.component';
import { RondasService } from '../../../../services/rondas.service';
import { EstadoConsenso } from '../../../../interfaces/estado-consenso';

@Component({
  selector: 'app-configurar-consenso',
  templateUrl: './configurar-consenso.component.html',
  styleUrls: ['./configurar-consenso.component.css',
    '../../../administrador/moderadores/page/moderadores.component.css']
})

/**
 * Moderador
 * Controlador de la Página Configurar Consenso: 
 * - Permite la configuración de un proceso de consenso: añadir items,
 * añadir atributos y añadir participantes
 */

export class ConfigurarConsensoComponent implements OnInit {

  public estados: EstadoConsenso[] = [
    { value: 'pausado', viewValue: 'Pausado' },
    { value: 'iniciado', viewValue: 'Iniciado' },
  ];

  //tabla Items
  public displayedColumns: string[] = ['nombre', 'descripcion', 'activo'];
  public dataSource = new MatTableDataSource();

  //Tabla Atributos
  public displayedColumnsAtributes: string[] = ['atributo', 'descripcion', 'activo'];
  public dataSourceAtributes = new MatTableDataSource();

  //Tabla Participantes
  public displayedColumnsParticipant: string[] = ['nombres', 'apellidos', 'activo'];
  public dataSourceParticipant = new MatTableDataSource();

  //Tabla Resultados Evaluacion Colectiva
  public displayedColumnsx: string[] = ['nombreItem', 'aceptacion', 'rechazo'];
  public dataEvaluacionColectiva = new MatTableDataSource();

  public idconsenso!: string;
  public consenso: any;


  public nivelalcanzado: any;
  public validatorFinalizado: any;
  public data: any[] = []; //Charset Grafica
  public disableoptions = false;
  public participantes: any[] = []
  public itemsRondaEvalColectFinal: any[] = []
  public resultado: any;

  public chartType: string = 'line';
  public chartDatasets: Array<any> = [{ data: this.data, label: 'Nivel de consenso colectivo' }];
  public chartLabels: Array<any> = [];
  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgb(242, 97, 63, .2)',
      borderColor: 'rgb(242, 97, 63, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    }

  ];

  public chartOptions: any = {
    responsive: true
  };

  private periodo!: number;
  private fecha_inicio!: Date;
  private idconsensofire: any;


  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private _servicioNotificacion: ToastrService,
    private _servicioConsenso: ConsensoServiceService,
    private _servicioModerador: ModeradorService,
    private dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private _servicioEvaluacion: EvaluacionService,
    private _servicioRondas: RondasService
  ) { }

  async ngOnInit() {
    this.idconsenso = this.route.snapshot.paramMap.get('consensoId') as string;
    await this.getConsensus();
    this._servicioModerador._recuperarItems(this.idconsenso)
      .subscribe(item => this.dataSource.data = item);
    this._servicioModerador._recuperarAtributos(this.idconsenso)
      .subscribe(atributo => this.dataSourceAtributes.data = atributo);
    this._servicioModerador._recuperarParcipantesConsenso(this.idconsenso)
      .subscribe(participante => this.dataSourceParticipant.data = participante);
    if (this.consenso?.estado == 'finalizado') {
      await this.getEvaluacionfinal().then(async () => {
        this.validatorFinalizado = this.consenso?.estado == 'finalizado';
        this.dataEvaluacionColectiva.data = this.itemsRondaEvalColectFinal;
        await this.getRondas();
      });
      if (this.nivelalcanzado < this.consenso?.nivel_consenso) {
        this.resultado = 'No se llegó a un consenso';
      } else {
        this.resultado = 'Se llegó a un consenso';
      }
    }
  }

  private async getRondas() {
    await this._servicioRondas._recuperarRondasEnResultados(this.idconsenso).pipe(take(1)).toPromise()
      .then(async (res) => {
        this.chartLabels = [];
        for (let element of res) {
          this.data.push(element.nivel);
          this.chartLabels.push(`Ronda ${element.ronda}`);
          this.chartDatasets = [
            { data: this.data, label: 'Nivel de consenso colectivo' }
          ]
        };

      })
  }

  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  onEstadoChange(ob: any) {
    const dialogRef = this.dialog.open(DialogConfirmacionEstado, {
      width: '450px',
      data: { idConsenso: this.idconsenso, value: ob.value }
    });
  }

  private async getEvaluacionfinal() {
    await this._servicioEvaluacion._recuperarEvaluacionColectivaFinal(this.idconsenso, this.consenso?.rondas).pipe(take(1)).toPromise()
      .then(async (res: any) => {
        if (res[0] != undefined) {
          this.nivelalcanzado = await res[0].nivelactual
          for (let element of res[0].items) {
            let itemdata = {
              nombreItem: '',
              aceptacion: element.aceptacion,
              rechazo: element.rechazo,
            }
            const name = this._servicioConsenso._recuperarItem(element.iditem).pipe(take(1)).toPromise();
            await name.then((value: any) => {
              itemdata.nombreItem = value.data()['nombre']
              element.atrAceptacion.forEach((element: any) => {
                this._servicioConsenso._recuperarAtributoporId(element).pipe(take(1)).toPromise().then((res: any) => {
                  itemdata.aceptacion += " " + res.data().atributo + ","
                })
              });
              element.atrRechazo.forEach((element: any) => {
                this._servicioConsenso._recuperarAtributoporId(element).pipe(take(1)).toPromise().then((res: any) => {
                  itemdata.rechazo += " " + res.data().atributo + ","
                })
              });
            });
            this.itemsRondaEvalColectFinal.push(itemdata)
          }

        };
      }).catch()
  }

  private async getConsensus() {
    await this._servicioConsenso._recuperarConsensos(this.idconsenso).pipe(take(1)).toPromise().then((value) => {
      value.map(e => {
        this.consenso = e.payload.doc.data();
        this.idconsensofire = e.payload.doc.id;
        this.fecha_inicio = this.consenso.fecha_inicio.toDate();
        this.periodo = this.consenso.periodo_rondas;
        this.disableoptions = this.consenso.estado != 'No iniciado';
      })
    });
  }

  public async newItem() {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id_consenso: this.idconsenso
    }
    this.dialog.open(AddItemComponent, dialogConfig);
  }

  public async newAttribute() {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id_consenso: this.idconsenso
    }
    this.dialog.open(AddAtributeComponent, dialogConfig);
  }

  public async newParticipant() {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = {
      id_consenso: this.idconsenso,
      codigo: this.consenso?.codigo
    }
    this.dialog.open(AddParticipantComponent, dialogConfig)
      .afterClosed().subscribe((participantes: any) => {
        participantes.participantes.forEach((element: any) => {
          if (!this.participantes.includes(element)) {
            this.participantes.push(element)
          }
        });
        this.dataSourceParticipant.data = this.participantes;
      });
  }

  public deleteDialog(valor: string, elemento: any) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      titulo: `Eliminar ${valor}`,
      mensaje: `¿Está seguro que desea eliminar este ${valor}?`
    }
    this.dialog.open(ConfirmationDialogComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res) {
          if (valor == 'atributo') {
            this._servicioModerador._eliminarAtributo(elemento.id).then(() => {
              this._servicioNotificacion.success('Atributo eliminado con éxito')
            }).catch(() => this._servicioNotificacion.error('No se pudo eliminar el atributo'))
          } else {
            this._servicioModerador._eliminarItem(elemento.id).then(() => {
              this._servicioNotificacion.success('Ítem eliminado con éxito')
            }).catch(() => this._servicioNotificacion.error('No se pudo eliminar el ítem'))
          }
        }
      });
  }

  public iniciarproceso() {
    this.SpinnerService.show();
    if (this.dataSource.data.length < 2 || this.dataSourceParticipant.data.length < 1) {
      this._servicioNotificacion.warning('No existen suficientes datos para iniciar el proceso');
      this.SpinnerService.hide();
    } else {
      var error = false
      this.dataSource.data.forEach((item: any) => {
        this.dataSourceAtributes.data.forEach((atributo: any) => {
          this._servicioConsenso._actualizarItemAtributosAceptacion(item.id, atributo.id);
          this._servicioConsenso._actualizarItemAtributosRechazo(item.id, atributo.id)
        });
      });
      for (let ronda = 1; ronda <= this.consenso?.rondas; ronda++) {
        var init = new Date(this.fecha_inicio.getTime());
        var endt = new Date(this.fecha_inicio.setHours(this.fecha_inicio.getHours() + (this.periodo)));
        var recordRonda = {
          idconsenso: this.idconsenso,
          orden: ronda,
          finalizado: false,
          fecha_1: init,
          fecha_2: endt,
          participantes: [],
          nivelconsenso: 0
        }

        this._servicioModerador._generarRonda(recordRonda).catch(() => {
          error = true
          this._servicioNotificacion.error('Una ronda no se ha guardado correctamente');
          this.SpinnerService.hide();
        })
      }

      this.participantes.forEach((element: any) => {
        this.verificarExistenciaParticipante(element);
      });
      if (!error) {
        this._servicioModerador._iniciarConsenso(this.idconsensofire).then(() => {
          this._servicioModerador._actualizarParticipantesConsenso(this.idconsensofire, this.participantes.length).then(() => {
            this.disableoptions = true;
          }).catch(() => {
            this._servicioNotificacion.error('Ha ocurrido un error al actualizar el proceso de consenso');
          })
        }).catch(() => {
          this._servicioNotificacion.error('Ha ocurrido un error al actualizar el proceso de consenso');
        });
        this._servicioNotificacion.success('Proceso de consenso configurado con éxito');
      }
      this.SpinnerService.hide();
    }
  }

  private async verificarExistenciaParticipante(element: any) {
    let verificar = await (await this._servicioModerador._verificarParticipante(element)).pipe(take(1)).toPromise();
    if (verificar.length == 0) { //Nuevo participante
      await this._servicioModerador._crearParticipante(element.nombres, element.apellidos, element.correo);
    }
    this.enviarInvitacion(element)
  }

  private async enviarInvitacion(element: any) {
    let user = (await this._servicioModerador._recuperarParticipanteporCorreo(element.correo)).pipe(take(1)).toPromise()
    user.then((res: any) => {
      const record = {
        nombres: res[0]['nombres'],
        apellidos: res[0]['apellidos'],
        email: res[0]['email'],
        uid_participante: res[0]['uid'],
        id_proceso_consenso: this.idconsenso,
        codigo: this.consenso?.codigo,
        aceptado: false,
      }
      if (res[0]['rol'] == 'participante') {
        this._servicioModerador._enviarInvitacion(record)
      }
    })
  }
}
