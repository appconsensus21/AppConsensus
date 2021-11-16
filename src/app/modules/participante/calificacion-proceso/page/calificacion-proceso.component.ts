import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipanteService } from 'src/app/services/participante.service';
import { take } from 'rxjs/operators';
import { ConsensoServiceService } from '../../../../services/consenso-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { ModeradorService } from 'src/app/services/moderador.service';
import { MatSlider } from '@angular/material/slider';
import { ToastrService } from 'ngx-toastr';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogEvaluacionIndividual } from '../../components/dialogo-evaluacion-individual/dialogEvaluacionIndividual.component';
import { AddAtributeComponent } from '../../../moderador/components/add-atribute/add-atribute.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { RondasService } from '../../../../services/rondas.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { EvaluacionIndividual } from '../../../../interfaces/evaluacion-individual';
import { EvaluacionItem } from '../../../../interfaces/evaluacion-item';

@Component({
  selector: 'app-calificacion-proceso',
  templateUrl: './calificacion-proceso.component.html',
  styleUrls: ['./calificacion-proceso.component.css',
    '../../../administrador/moderadores/page/moderadores.component.css'],
})
/**
 * Participante
 * Controlador de la Página Calificación Proceso: 
 * - Permite realizar la evaluación de items de un proceso de consenso.
 * - Permite visualizar los resultados de la evaluación previa.
 * - Permite agregar y seleccionar atributos.
 * - Permite visualizar el resumen de la evaluación.
 */
export class CalificacionProcesoComponent implements OnInit {
  @ViewChild('unsuit') unsuit!: MatSlider;
  @ViewChild('suit') suit!: MatSlider;
  @ViewChild('added') added!: MatCheckbox;

  public dataSource = new MatTableDataSource();
  public displayedColumnsmeta: string[] = ['Clave', 'Descripción'];

  public idronda = '';
  public idconsenso = '';
  public ronda = 0;
  public nivelconsensoronda = '';
  public items: any[] = [];
  public suitable: number = 0;
  public unsuitable: number = 0;
  public consenso: any;
  public valueSetSuit = 0;
  public valueSetUnSuit = 0;
  public auxsuit = 0;
  public auxunsuit = 0;
  public itemsRondaPrevEdit: any[] = [];
  public sugerencias: any[] = [];

  private participantes = [];
  private user: any;
  private validadorRondaPrev = false;
  private prevRonda = 0;
  private idRondaPrev = [];
  private arrayItemSuitable: string[] = [];
  private arrayItemUnSuitable: string[] = [];
  private itemsRondaPrev: any;
  private itemsRondaColectPrev: any;
  private itemsRondaColectPrevEdit: any[] = [];
  private evaluacionesItems: EvaluacionItem[] = [];

  constructor(
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private _servicioParticipante: ParticipanteService,
    private _servicioConsenso: ConsensoServiceService,
    private _servicioModerador: ModeradorService,
    private _servicioNotificacion: ToastrService,
    private _servicioEvaluacion: EvaluacionService,
    private _servicioRondas: RondasService,
    private _servicioUsuario: UsuarioService,
  ) { }

  async ngOnInit() {
    this.idronda = this.route.snapshot.paramMap.get('rondaId') as string;
    await this.getRonda();
    await this.getUser();
    await this.getConsensus();
    await this.getItems();
    this._servicioModerador._recuperarAtributos(this.idconsenso)
      .subscribe(atr => this.dataSource.data = atr);
    await this.rondaPrevia();
  }

  private async getUser() {
    this.user = await this._servicioUsuario._recuperarDataUsuario();
  }

  private async getConsensus() {
    this._servicioConsenso._recuperarConsensos(this.idconsenso).subscribe((consenso: any) => {
      consenso.map((e: any) => {
        this.consenso = e.payload.doc.data();
      });
    });
  }

  private async getRonda() {
    const ronda = this._servicioParticipante._recuperarRondaporId(this.idronda).pipe(take(1)).toPromise();
    await ronda.then((round: any) => {
      this.ronda = round.data()['orden']
      this.idconsenso = round.data()['idconsenso']
      this.nivelconsensoronda = round.data()['nivelconsenso']
      this.participantes = round.data()['participantes']
    })
  }

  private async getItems() {
    const item = (this._servicioParticipante._recuperarItemsParticipante(this.idconsenso)).pipe(take(1)).toPromise();
    await item.then((res) => {
      let auxitems = [] as any[];
      res.forEach((element: any) => {
        let itemconst = {
          nombre: element.nombre,
          descripcion: element.descripcion,
          metadata: element.metadata,
          foto: element.foto,
          atributosaceptacion: this.leerAtributos(element.atributosaceptacion),
          atributosrechazo: this.leerAtributos(element.atributosrechazo),
          id: element.id
        }
        auxitems.push(itemconst)
      });
      this.items = auxitems
    })

  }

  private leerAtributos(array: any) {
    let arrayatributos = [] as any[]
    array.forEach((atracep: any) => {
      this._servicioConsenso._recuperarAtributoporId(atracep).pipe(take(1)).toPromise().then((res: any) => {
        arrayatributos.push({ atributo: res.data().atributo, valor: res.data().valor, id: res.id })
      })
    });
    return arrayatributos;
  }

  public setsuitable(value: number) {
    if (value >= 1) {
      return (value / 100);
    }
    return value;
  }

  public setunsuitable(value: number) {
    if (value >= 1) {
      return (value / 100);
    }
    return value;
  }

  public cambiarSlider(isunsuit: boolean, element: any) {
    if (isunsuit) {
      this.auxsuit = element / 100;
      if (this.getTotal() > 1) {
        this._servicioNotificacion.warning('El valor aprobación se excede del límite de 1')
      }
    } else {
      this.auxunsuit = element / 100;
      if (this.getTotal() > 1) {
        this._servicioNotificacion.warning('El valor rechazo se excede del límite de 1')
      }
    }
  }

  private getTotal() {
    return Number((this.auxunsuit + this.auxsuit).toFixed(2))
  }

  private removeFromArray(id: any) {
    this.evaluacionesItems = this.evaluacionesItems.filter(item => item.idItem !== id);
  }

  private removeFromArraySuitable(content: any) {
    this.arrayItemSuitable = this.arrayItemSuitable.filter(item => item !== content);
  }

  private removeFromArrayUnSuitable(content: any) {
    this.arrayItemUnSuitable = this.arrayItemUnSuitable.filter(item => item !== content);
  }

  public iniciarItem(item1: any, item2: any, itemNombre: any) {
    this.arrayItemSuitable = [];
    this.arrayItemUnSuitable = [];
    this.dataSource = new MatTableDataSource();
    this._servicioModerador._recuperarAtributos(this.idconsenso)
      .subscribe(atr => this.dataSource.data = atr);
    item1.value = 0;
    item2.value = 0;
    this.suit.value = 0;
    this.unsuit.value = 0;
    this.auxsuit = 0;
    this.auxunsuit = 0;
    this.valueSetSuit = 0;
    this.valueSetUnSuit = 0;
    if (this.itemsRondaPrevEdit.length > 0) {
      for (let i in this.itemsRondaPrevEdit) {
        if (this.itemsRondaPrevEdit[i]['nombreItem'] === itemNombre) {
          var valorAceptacion = Number(this.itemsRondaPrevEdit[i]['aceptacion'].split(' ')[0]);
          var valorRechazo = Number(this.itemsRondaPrevEdit[i]['rechazo'].split(' ')[0]);
          this.suit.value = valorAceptacion;
          this.unsuit.value = valorRechazo;
          this.auxsuit = valorAceptacion;
          this.auxunsuit = valorRechazo;
          item1.value = valorAceptacion;
          item2.value = valorRechazo;
          this.valueSetSuit = valorAceptacion * 100;
          this.valueSetUnSuit = valorRechazo * 100;
        }
      }
    }
  }

  public guardarEvaluacionItem(idItem: any) {
    if (this.getTotal() > 1) {
      this._servicioNotificacion.warning('El nivel de consenso excede el límite de 1')
    } else {
      let registroItem: EvaluacionItem =
      {
        idItem: idItem.id,
        valorAceptacion: this.auxsuit,
        valorRechazo: this.auxunsuit,
        arrayAceptacion: this.arrayItemSuitable,
        arrayRechazo: this.arrayItemUnSuitable
      };
      if (this.evaluacionesItems.length == 0) {
        this.evaluacionesItems.push(registroItem);
      } else {
        //PARA ACTUALIZAR
        for (let element of this.evaluacionesItems) {
          if (element.idItem == registroItem.idItem) {
            element.valorAceptacion = registroItem.valorAceptacion;
            element.valorRechazo = registroItem.valorRechazo;
            element.arrayAceptacion = registroItem.arrayAceptacion;
            element.arrayRechazo = registroItem.arrayRechazo;
            break;
          }
          //PARA AGREGAR UNO NUEVO
          else if (this.evaluacionesItems.length < this.items.length) {
            this.evaluacionesItems.push(registroItem);
            break;
          } else {
            this.removeFromArray(registroItem.idItem);
            this.evaluacionesItems.push(registroItem);
            break;
          }
        }
      }
    }
    this._servicioNotificacion.success('Evaluación de ítem registrada');
  }

  public onChangeUnSuitable(e: any) {
    if (!this.arrayItemUnSuitable.includes(e)) {
      this.arrayItemUnSuitable.push(e);
    } else {
      this.removeFromArrayUnSuitable(e);
    }
  }

  public onChangeSuitable(e: any) {
    if (!this.arrayItemSuitable.includes(e)) {
      this.arrayItemSuitable.push(e);
    } else {
      this.removeFromArraySuitable(e);
    }

  }

  public async guardarEvaluacionParticipante() {
    if (this.evaluacionesItems.length != this.items.length) {
      this._servicioNotificacion.warning('Debe guardar las evaluaciones de cada ítem', 'Evaluación incompleta')
    } else {
      this.user = await this._servicioUsuario._recuperarDataUsuario();
      let evaluacionIndividual: EvaluacionIndividual = {
        idRonda: this.idronda,
        idParticipante: this.user.uid,
        idConsenso: this.idconsenso,
        item: this.evaluacionesItems,
        consensoindividual: 0,
      };
      this.abrirResumen(evaluacionIndividual);
    }
  }

  private abrirResumen(element: any): void {
    const dialogRef = this.dialog.open(DialogEvaluacionIndividual, {
      width: '70%',
      data: {
        element,
        nivel: this.consenso.nivel_consenso,
        ronda: this.ronda,
        rondas: this.consenso.rondas,
        totalparticipantes: this.consenso.participantes_totales,
        participantes: this.participantes,
        consensoindividual: 0
      }
    });
  }

  public async newAttribute(tipo: any, item: any) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id_consenso: this.idconsenso,
      atraceptacion: item.atributosaceptacion,
      atrrechazo: item.atributosrechazo,
      tipo
    }
    let dialogRef = this.dialog.open(AddAtributeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (tipo === 'aceptacion') {
          item.atributosaceptacion.push(result);
        } else if (tipo === 'rechazo') {
          item.atributosrechazo.push(result);
        }
      }
    });
  }

  private async rondaPrevia() {
    if (this.ronda - 1 > 0) {
      this.validadorRondaPrev = true;
      this.prevRonda = this.ronda - 1;
      let x = this._servicioRondas._recuperarRondaPrevia(this.idconsenso, this.prevRonda).pipe(take(1)).toPromise();
      await x.then((res: any) => {
        this.idRondaPrev = res;
      });
      let y = this._servicioEvaluacion._recuperarEvaluacionPrevia(this.idconsenso, this.user.uid, this.idRondaPrev[0]).pipe(take(1)).toPromise();
      await y.then(async (resp) => {
        if (resp != undefined) {
          this.itemsRondaPrev = resp[0].item;
          for (let element of this.itemsRondaPrev) {
            let dataindividual = {
              nombreItem: '',
              aceptacion: element.valorAceptacion,
              rechazo: element.valorRechazo,
            }
            let name = this._servicioConsenso._recuperarItem(element.idItem).pipe(take(1)).toPromise();
            await name.then((value: any) => {
              dataindividual.nombreItem = value.data()['nombre'],
                element.arrayAceptacion.forEach((atracep: any) => {
                  this._servicioConsenso._recuperarAtributoporId(atracep).pipe(take(1)).toPromise().then((res: any) => {
                    dataindividual.aceptacion += " " + res.data().atributo + ","
                  })
                });
              element.arrayRechazo.forEach((atracep: any) => {
                this._servicioConsenso._recuperarAtributoporId(atracep).pipe(take(1)).toPromise().then((res: any) => {
                  dataindividual.rechazo += " " + res.data().atributo + ","
                })
              });
            });

            this.itemsRondaPrevEdit.push(dataindividual);
          }
        }
      }).catch(() => {
        this.itemsRondaPrev = []
      });

      let evalColect = this._servicioEvaluacion._recuperarEvaluacionColectivaPrev(this.idconsenso, this.idRondaPrev[0]).pipe(take(1)).toPromise();
      await evalColect.then(async (params: any) => {
        if (params != undefined) {
          this.itemsRondaColectPrev = params[0].items;
          for (let element of this.itemsRondaColectPrev) {
            let dataitem = {
              nombreItem: '',
              id: element.iditem,
            }
            let name = this._servicioConsenso._recuperarItem(element.iditem).pipe(take(1)).toPromise();
            await name.then((value: any) => {
              dataitem.nombreItem = value.data()['nombre'];
            });
            this.itemsRondaColectPrevEdit.push(dataitem)
          }
        }
      });
      await this.cargarSugerencias();
    } else {
      this.validadorRondaPrev = false;
    }
  }

  private async cargarSugerencias() {
    await this._servicioEvaluacion._recuperarSugerencias(this.idRondaPrev[0], this.user.uid).pipe(take(1)).toPromise()
      .then(async (results) => {
        if (results != undefined) {
          this.itemsRondaColectPrevEdit.forEach((element: any) => {
            let sugerenciaS = {
              nombreItem: element.nombreItem,
              sugerencia: [] as any[],
            }
            results[0].sugereciasSuitable.forEach(async (param: any) => {
              if (element.id == param.idItem) {
                let atributosnom = [] as any[];
                let suitable = {
                  tema: 'suitable',
                  valor: param.valor,
                  atributos: atributosnom,
                  incrementar: param.incrementar
                }
                if (param.atributos.length != 0) {
                  param.atributos.forEach(async (atributo: any) => {
                    let name = this._servicioConsenso._recuperarAtributoporId(atributo).pipe(take(1)).toPromise();
                    await name.then((value: any) => {
                      atributosnom.push(value.data()['atributo'])
                    });
                  });
                }
                sugerenciaS.sugerencia.push(suitable)
              }
            });
            results[0].sugerenciasUnsuitable.forEach((param: any) => {
              if (element.id == param.idItem) {
                let atributosnom = [] as any[];

                let unsuitable = {
                  tema: 'unsuitable',
                  valor: param.valor,
                  atributos: atributosnom,
                  incrementar: param.incrementar
                }
                if (param.atributos.length != 0) {
                  param.atributos.forEach(async (atributo: any) => {
                    let name = this._servicioConsenso._recuperarAtributoporId(atributo).pipe(take(1)).toPromise();
                    await name.then((value: any) => {
                      atributosnom.push(value.data()['atributo'])
                    });
                  });
                }
                sugerenciaS.sugerencia.push(unsuitable)
              }
            });
            this.sugerencias.push(sugerenciaS)
          });
        }
      }).catch(() => {
        this.sugerencias = []
      })
  }
}
