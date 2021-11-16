import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { EvaluacionService } from 'src/app/services/evaluacion.service';
import { ConsensoServiceService } from '../../../../services/consenso-service.service';
import { ParticipanteService } from '../../../../services/participante.service';
import { RondasService } from '../../../../services/rondas.service';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-evaluacion-proceso',
  templateUrl: './evaluacion-proceso.component.html',
  styleUrls: ['./evaluacion-proceso.component.css', '../../../administrador/consensos/page/consenso.component.css',
    '../../../administrador/moderadores/page/moderadores.component.css']
})
/**
 * Participante
 * Controlador de la Página Evaluación Proceso: 
 * - Permite visualizar el proceso de consenso actual y su estado:
 *  - Consenso alcanzado.
 *  - Información del proceso de consenso.
 *  - Número de ronda a evaluar.
 * - Permite visualizar los resultados de la ronda previa.
 * - Permite visualizar sugerencias.
 */

export class EvaluacionProcesoComponent implements OnInit {

  displayedColumnsx: string[] = ['nombreItem', 'aceptacion', 'rechazo'];

  public consenso: any;
  public consensoid: string = ''; //Doc id de firebase
  public ronda !: number;
  public fechainicioronda!: Date;
  public fechafinronda!: Date;
  public nivelconsensoronda: number = 0;
  public finalizado = false;
  public validadorRondaPrev: any;
  public isevaluated: any;
  public user: any;
  public rondanoinicia = false;
  public sugerencias: any[] = [];
  public dataSourceIndividual = new MatTableDataSource();
  public dataSourceColectiva = new MatTableDataSource();

  private idconsenso!: string;
  private idronda = '';
  private rondaprevfinalizada = false;
  private prevRonda: any;
  private participantes: any[] = []
  private idRondaPrev: any;
  private itemsRondaPrev: any;
  private itemsRondaPrevEdit: any[] = [];
  private itemsRondaColectPrev: any;
  private itemsRondaColectPrevEdit: any[] = [];


  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private _servicioNotificacion: ToastrService,
    private _servicioConsenso: ConsensoServiceService,
    private _servicioPartici: ParticipanteService,
    private _servicioEvaluacion: EvaluacionService,
    private _servicioRondas: RondasService,
    private _servicioUsuario: UsuarioService
  ) { }

  async ngOnInit() {
    this.idconsenso = this.route.snapshot.paramMap.get('consensoId') as string;
    await this.getUser();
    await this.getConsensus();
    await this.filtrarRondas();
    this.isevaluated = this.verificarEvaluacionParticipante();
    await this.verificarRonda();
  }

  private async getUser() {
    this.user = await this._servicioUsuario._recuperarDataUsuario();
  }

  private async getConsensus() {
    this._servicioConsenso._recuperarConsensos(this.idconsenso).subscribe((consenso) => {
      consenso.map(e => {
        this.consenso = e.payload.doc.data();
        this.consensoid = e.payload.doc.id;
      });
    });
  }

  private async filtrarRondas() {
    const ronda = (this._servicioRondas.recuperarRonda(this.idconsenso)).pipe(take(1)).toPromise();
    await ronda.then((res) => {
      if (res[0] !== undefined) {
        this.idronda = res[0].idronda;
        this.ronda = res[0].ronda;
        this.fechainicioronda = res[0].fechainicioronda.toDate();
        this.fechafinronda = res[0].fechafinronda.toDate();
        this.participantes = res[0].participantes;
        this.nivelconsensoronda = (res[0].nivel).toFixed(2);
      }
    })
  }

  private async resumen() {
    let x = this._servicioRondas._recuperarRondaPrevia(this.idconsenso, this.prevRonda).pipe(take(1)).toPromise();
    await x.then((res) => {
      this.idRondaPrev = res;
    })
    let y = this._servicioEvaluacion._recuperarEvaluacionPrevia(this.idconsenso, this.user.uid, this.idRondaPrev[0]).pipe(take(1)).toPromise();
    await y.then(async (resp) => {
      this.itemsRondaPrev = resp[0].item;
      for (let element of this.itemsRondaPrev) {
        let dataindividual = {
          nombreItem: '',
          aceptacion: element.valorAceptacion,
          rechazo: element.valorRechazo,
          atributosAceptacion: element.arrayAceptacion,
          atributosRechazo: element.arrayRechazo
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
        this.itemsRondaPrevEdit.push(dataindividual)
      }
    }).catch(() => {
      this.itemsRondaPrev = []
    })

    let evalColect = this._servicioEvaluacion._recuperarEvaluacionColectivaPrev(this.idconsenso, this.idRondaPrev[0]).pipe(take(1)).toPromise();
    await evalColect.then(async (params: any) => {
      this.nivelconsensoronda = (params[0].nivelactual).toFixed(2);
      this.itemsRondaColectPrev = params[0].items;
      for (let element of this.itemsRondaColectPrev) {
        let dataitem = {
          nombreItem: '',
          id: element.iditem,
          aceptacion: element.aceptacion,
          rechazo: element.rechazo,
          atributosAceptacion: element.atrAceptacion,
          atributosRechazo: element.atrRechazo
        }
        let name = this._servicioConsenso._recuperarItem(element.iditem).pipe(take(1)).toPromise();
        await name.then((value: any) => {
          dataitem.nombreItem = value.data()['nombre'];
          element.atrAceptacion.forEach((atracep: any) => {
            this._servicioConsenso._recuperarAtributoporId(atracep).pipe(take(1)).toPromise().then((res: any) => {
              dataitem.aceptacion += " " + res.data().atributo + ","
            })
          });
          element.atrRechazo.forEach((atracep: any) => {
            this._servicioConsenso._recuperarAtributoporId(atracep).pipe(take(1)).toPromise().then((res: any) => {
              dataitem.rechazo += " " + res.data().atributo + ","
            })
          });

        });
        this.itemsRondaColectPrevEdit.push(dataitem)
      }
    })
  }

  private async verificarRonda() {
    const validacion_1 = (new Date() > this.fechainicioronda ? true : false);
    const validacion_2 = (this.fechafinronda > new Date() ? true : false);
    if (this.ronda - 1 > 0) {
      this.validadorRondaPrev = true;
      this.prevRonda = this.ronda - 1;
      let isfinalizado = this._servicioRondas._recuperarEstadoRonda(this.idconsenso, this.prevRonda).pipe(take(1)).toPromise();
      await isfinalizado.then((res: any) => {
        this.rondaprevfinalizada = res;
      });
    } else {
      this.validadorRondaPrev = false;
    }
    if ((validacion_1 && validacion_2) || (this.rondaprevfinalizada && validacion_2)) {
      if (this.validadorRondaPrev) {
        await this.resumen();
        this.dataSourceIndividual.data = this.itemsRondaPrevEdit;
        this.dataSourceColectiva.data = this.itemsRondaColectPrevEdit;
        if (this.nivelconsensoronda >= this.consenso.nivel_consenso) {
          this._servicioNotificacion.info('El nivel de consenso esperado ha sido alcanzado', 'Aviso');
          this.isevaluated = true;
          this._servicioConsenso._actualizarConsenso(this.consensoid, 'finalizado');
          const rondasRestantes = this._servicioRondas._recuperarRondas(this.idconsenso).pipe(take(1)).toPromise();
          await rondasRestantes.then((res: any) => {
            for (let ronda of res) {
              this._servicioPartici._finalizarRonda(ronda.idronda);
            }
          }).catch((error: any) => {
            console.log(error);
          })
        }
        await this.cargarSugerencias();
      }
    } else if (!validacion_1) {
      this.isevaluated = true;
      this.rondanoinicia = true;
      this._servicioNotificacion.warning('La ronda aún no ha iniciado')
    } else {
      
      //Esta fuera del rango del tiempo de duracion de la ronda
      if (this.idronda != '') {
        if (this.ronda == this.consenso.rondas && !validacion_2 || this.ronda > this.consenso.rondas) {
          this._servicioNotificacion.info('El proceso de consenso ha finalizado');
          this._servicioConsenso._actualizarConsenso(this.consensoid, 'finalizado');
          this.router.navigate(['/appParticipante/listaConsensos']);
          return;
        }

        if (this.ronda <= this.consenso.rondas) {
          this._servicioEvaluacion._algoritmoFASTCR(this.idconsenso, this.idronda, this.consenso.nivel_consenso, this.ronda == this.consenso.rondas, this.ronda);
          this._servicioPartici._finalizarRonda(this.idronda).then(() => {
            this.ngOnInit();
            return;
          })
        }

      } else {
        this.finalizado = true
      }

    }
  }

  private async cargarSugerencias() {
    await this._servicioEvaluacion._recuperarSugerencias(this.idRondaPrev[0], this.user.uid).pipe(take(1)).toPromise()
      .then(async (results) => {

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
      }).catch(() => {
        this.sugerencias = []
      })
  }

  private verificarEvaluacionParticipante() {
    return this.participantes.includes(this.user.uid)
  }

  public calificar() {
    this.router.navigate([`appParticipante/calificacionProceso/${this.idronda}`]);
  }
}
