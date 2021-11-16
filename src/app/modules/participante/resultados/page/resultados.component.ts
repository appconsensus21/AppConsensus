import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluacionService } from '../../../../services/evaluacion.service';
import { take } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { ConsensoServiceService } from '../../../../services/consenso-service.service';
import { RondasService } from '../../../../services/rondas.service';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css', '../../../administrador/consensos/page/consenso.component.css',
    '../../../administrador/moderadores/page/moderadores.component.css']
})

/**
 * Participante
 * Controlador de la Página Resultados: 
 * - Permite visualizar los resultados de un proceso de consenso:
 *  - Visualizar gráfica y tabla de resultados de la última ronda realizada.
 */

export class ResultadosComponent implements OnInit {

  public displayedColumnsx: string[] = ['nombreItem', 'aceptacion', 'rechazo'];
  public dataSource = new MatTableDataSource();

  public _resultado: any;
  public consenso: any;
  public itemsRondaEvalColectFinal: any[] = []
  public data: any[] = []
  public _individualConsenso: any[] = [];
  public nivelalcanzado: number = 0;
  public chartType: string = 'line';

  private idconsenso = '';
  private user: any;

  public chartDatasets: Array<any> = [
    { data: this.data, label: 'Nivel de consenso colectivo' },
    { data: this._individualConsenso, label: 'Nivel de consenso individual' },
  ];

  public chartLabels: Array<any> = ['Ronda 1', 'Ronda 2', 'Ronda 3', 'Ronda 4'];

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

  constructor(
    private _route: ActivatedRoute,
    private _servicioEvaluacion: EvaluacionService,
    private _servicioConsenso: ConsensoServiceService,
    private _servicioRondas: RondasService,
    private _servicioUsuario: UsuarioService
  ) { }

  async ngOnInit() {
    this.idconsenso = this._route.snapshot.paramMap.get('consensoId') as string;
    await this.getConsensus();
    await this.getUser();
    await this.getEvaluacionfinal().then(() => {
      this.dataSource.data = this.itemsRondaEvalColectFinal;
    });
    await this.getRondas();
    if (this.nivelalcanzado < this.consenso.nivel_consenso) {
      this._resultado = 'No se llegó a un consenso';
    } else {
      this._resultado = 'Se llegó a un consenso';
    }
  }

  private async getConsensus() {
    this._servicioConsenso._recuperarConsensos(this.idconsenso).subscribe((consenso) => {
      consenso.map(async e => {
        this.consenso = await e.payload.doc.data();
      });
    });
  }

  private async getUser() {
    this.user = await this._servicioUsuario._recuperarDataUsuario();
  }

  private async getEvaluacionfinal() {
    await this._servicioEvaluacion._recuperarEvaluacionColectivaFinal(this.idconsenso, this.consenso?.rondas).pipe(take(1)).toPromise()
      .then(async (res: any) => {
        if (res[0] != undefined) {
          this.nivelalcanzado = await res[0].nivelactual;
          this.nivelalcanzado.toFixed(2);
          for (let element of res[0].items) {
            let itempush = {
              nombreItem: '',
              aceptacion: element.aceptacion,
              rechazo: element.rechazo,
              idatributosAceptacion: element.atrAceptacion,
              idatributosRechazo: element.atrRechazo,
            }
            const name = this._servicioConsenso._recuperarItem(element.iditem).pipe(take(1)).toPromise();
            await name.then((value: any) => {
              itempush.nombreItem = value.data()['nombre']
              element.atrAceptacion.forEach((atracep: any) => {
                this._servicioConsenso._recuperarAtributoporId(atracep).pipe(take(1)).toPromise().then((res: any) => {
                  itempush.aceptacion += " " + res.data().atributo + ","
                })
              });
              element.atrRechazo.forEach((atracep: any) => {
                this._servicioConsenso._recuperarAtributoporId(atracep).pipe(take(1)).toPromise().then((res: any) => {
                  itempush.rechazo += " " + res.data().atributo + ","
                })
              });
            });
            this.itemsRondaEvalColectFinal.push(itempush)
          };
        }
      })
  }

  private async getRondas() {
    await this._servicioRondas._recuperarRondasEnResultados(this.idconsenso).pipe(take(1)).toPromise()
      .then(async (res) => {
        this.chartLabels = [];
        for (let element of res) {
          await this._servicioEvaluacion._recuperarEvaluacionesIndividuales(element.idronda, this.user.uid).pipe(take(1)).toPromise()
            .then((evalindividual) => {
              if (evalindividual.length == 0) {
                this._individualConsenso.push(0)
              } else {
                this._individualConsenso.push(evalindividual[0].consensoindividual)
              }
            })
          this.data.push(element.nivel);
          this.chartLabels.push(`Ronda ${element.ronda}`);
          this.chartDatasets = [
            { data: this.data, label: 'Nivel de consenso colectivo' },
            { data: this._individualConsenso, label: 'Nivel de consenso individual' },
          ]
        };
      })
  }

  //Acciones para la grafica
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }
}
