import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { ConsensoServiceService } from './consenso-service.service';
import { SimilarityMeasureService } from './similarity-measure.service';
import { RondasService } from './rondas.service';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

  constructor(
    private _angularFirestore: AngularFirestore,
    private _servicioConsenso: ConsensoServiceService,
    private _servicioSimilarityMeasure: SimilarityMeasureService,
    private _servicioRondas: RondasService
  ) { }

  private _actualizarEvaluacionIndividual(id: string, items: any) {
    return this._angularFirestore.collection('evaluacion_individual').doc(id).update({ 'item': firebase.firestore.FieldValue.arrayUnion(items) });
  }

  private _removerItemEvaluacionIndividual(id: string, items: any) {
    return this._angularFirestore.collection('evaluacion_individual').doc(id).update({ 'item': firebase.firestore.FieldValue.arrayRemove(items) });
  }

  public _recuperarEvaluacionesIndividuales(idronda: any, iduser: any) {
    return this._angularFirestore.collection('evaluacion_individual', (ref) => ref.where('idRonda', '==', idronda)
      .where('idParticipante', '==', iduser)
    )
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              items: a.payload.doc.data()['item'],
              consensoindividual: a.payload.doc.data()['consensoindividual']
            }
            return data;
          })
        )
      )
  }

  public _crearEvaluacionIndividual(element: any) {
    return this._angularFirestore.collection('evaluacion_individual').add(element);
  }

  private _actualizarConsensoIndividual(id: any, value: any) {
    return this._angularFirestore.collection('evaluacion_individual').doc(id).update({ 'consensoindividual': value })
  }

  private _crearEvaluacionColectiva(element: any) {
    return this._angularFirestore.collection('evaluacion_colectiva').add(element);
  }

  private _crearSugerencias(element: any) {
    return this._angularFirestore.collection('sugerencias').add(element);
  }

  public _recuperarSugerencias(idronda: any, idparticipante: any) {
    return this._angularFirestore.collection('sugerencias', (ref) => ref.where('idRonda', '==', idronda)
      .where('idparticipante', '==', idparticipante)
    )
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              //id: a.payload.doc.id,
              sugereciasSuitable: a.payload.doc.data()['sugerenciasSuitable'],
              sugerenciasUnsuitable: a.payload.doc.data()['sugerenciasUnsuitable'],
            }
            return data;
          })
        )
      )
  }

  private _recuperarEvaluaciones(idproceso: any, idronda: any) {
    return this._angularFirestore.collection('evaluacion_individual', (ref) => ref.where('idConsenso', '==', idproceso)
      .where('idRonda', '==', idronda)
    )
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              idevaluacion: a.payload.doc.id,
              items: a.payload.doc.data()['item'],
              idparticipante: a.payload.doc.data()['idParticipante'],
              consenso: a.payload.doc.data()['consensoindividual']
            }
            return data;
          })
        )
      )
  }

  public _recuperarEvaluacionPrevia(idproceso: any, idusuario: any, idronda: any) {
    return this._angularFirestore.collection('evaluacion_individual', (ref) => ref.where('idConsenso', '==', idproceso).where('idParticipante', '==', idusuario).where('idRonda', '==', idronda))
      .snapshotChanges().pipe(
        map(act =>
          act.map((a: any) => {
            return a.payload.doc.data();
          })
        )
      );
  }

  public _recuperarEvaluacionColectivaPrev(idproceso: any, idronda: any) {
    return this._angularFirestore.collection('evaluacion_colectiva', (ref) => ref.where('idConsenso', '==', idproceso).where('idRonda', '==', idronda))
      .snapshotChanges().pipe(
        map(act =>
          act.map((a: any) => {
            return a.payload.doc.data();
          })
        )
      );
  }

  public _recuperarEvaluacionColectivaFinal(idconsenso: any, ronda: any) {
    return this._angularFirestore.collection('evaluacion_colectiva', (ref) => ref.where('idConsenso', '==', idconsenso)
      .where('evaluacionfinal', '==', true)
    )
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              //idevaluacion: a.payload.doc.id,
              items: a.payload.doc.data()['items'],
              nivelactual: a.payload.doc.data()['nivelactual'],
            }
            return data;
          })
        )
      )
  }

  private _leerEvaluaciones(evaluaciones: any[], itemsproceso: any[]) {
    evaluaciones.forEach((evaluacion: any) => {
      evaluacion['items'].forEach((item: any) => {
        itemsproceso.forEach((itemprocess: any) => {
          if (itemprocess.iditem == item.idItem) {
            itemprocess.valoresAceptacion.push(item.valorAceptacion);
            itemprocess.valoresRechazo.push(item.valorRechazo);
            item.arrayAceptacion.forEach((atributoacept: any) => {
              if (!itemprocess.atrAceptacion.includes(atributoacept)) { itemprocess.atrAceptacion.push(atributoacept) }
            });
            item.arrayRechazo.forEach((atributorechazo: any) => {
              if (!itemprocess.atrRechazo.includes(atributorechazo)) { itemprocess.atrRechazo.push(atributorechazo) }
            });
          }
        })
      });
    });
  }

  private _recuperarAtributosAceptacionRechazo(itemsproceso: any[]) {
    itemsproceso.forEach(element => {
      element.atrAceptacion.forEach((aaceptacion: any) => {
        this._servicioConsenso._actualizarItemAtributosAceptacion(element.iditem, aaceptacion);
      });
      element.atrRechazo.forEach((arechazo: any) => {
        this._servicioConsenso._actualizarItemAtributosRechazo(element.iditem, arechazo)
      });
    });
  }

  private _calcularSimilarityMeasure(evaluaciones: any[], itemsproceso: any[], valoresIndividuales: any[]) {
    evaluaciones.forEach((evaluacion: any) => {
      let individual: any = [];
      let colectiva: any = []
      evaluacion['items'].forEach((item: any) => {
        itemsproceso.forEach((itemprocess: any) => {
          if (itemprocess.iditem == item.idItem) {
            individual.push({
              id: item.idItem,
              membership: item.valorAceptacion,
              nonmembership: item.valorRechazo,
              hesitation: 1 - (item.valorAceptacion + item.valorRechazo)
            })
            colectiva.push({
              id: itemprocess.iditem,
              membership: itemprocess.aceptacion,
              nonmembership: itemprocess.rechazo,
              hesitation: 1 - (itemprocess.aceptacion + itemprocess.rechazo)
            })
          }
        })
      });
      //funcion _servicioSimilarityMeasure 
      let val = this._servicioSimilarityMeasure._getSimilarity(individual, colectiva, individual.length) as number;
      valoresIndividuales.push(val);
      this._actualizarConsensoIndividual(evaluacion.idevaluacion, val);
    });
  }

  public async _algoritmoFASTCR(idproceso: any, idronda: any, nivelesperado: any, ultimaronda: any, numeroronda: any) {
    let evaluaciones: any[] = []
    let itemsproceso: any[] = [];
    let valoresIndividuales: any[] = []
    let nivelcosenso = 0;

    //Verificar atributos unicos
    // await this._recuperarAtributosporConsensoId(idproceso).pipe(take(1)).toPromise().then(async (atributos: any)=>{
    //   await this._filtrarAtributos(atributos, idproceso, idronda)
    // });

    await this._servicioConsenso._recuperarItemsEvaluacion(idproceso).pipe(take(1)).toPromise().then((items: any) => {
      itemsproceso = items;
    });

    await this._recuperarEvaluaciones(idproceso, idronda).pipe(take(1)).toPromise().then((evaluacion) => {
      evaluaciones = evaluacion
    })

    //Leer Evaluaciones
    //this._leerEvaluaciones(evaluaciones, itemsproceso);
    if (evaluaciones.length > 0) {
      evaluaciones.forEach((evaluacion: any) => {
        evaluacion['items'].forEach((item: any) => {
          itemsproceso.forEach((itemprocess: any) => {
            if (itemprocess.iditem == item.idItem) {
              itemprocess.valoresAceptacion.push(item.valorAceptacion);
              itemprocess.valoresRechazo.push(item.valorRechazo);
              item.arrayAceptacion.forEach((atributoacept: any) => {
                if (!itemprocess.atrAceptacion.includes(atributoacept)) { itemprocess.atrAceptacion.push(atributoacept) }
              });
              item.arrayRechazo.forEach((atributorechazo: any) => {
                if (!itemprocess.atrRechazo.includes(atributorechazo)) { itemprocess.atrRechazo.push(atributorechazo) }
              });
            }
          })
        });
      });

      //Recuperar atributos de aceptacion y rechazo
      //this._recuperarAtributosAceptacionRechazo(itemsproceso);
      itemsproceso.forEach(element => {
        element.atrAceptacion.forEach((aaceptacion: any) => {
          this._servicioConsenso._actualizarItemAtributosAceptacion(element.iditem, aaceptacion);
        });
        element.atrRechazo.forEach((arechazo: any) => {
          this._servicioConsenso._actualizarItemAtributosRechazo(element.iditem, arechazo)
        });
      });

      //Obtener los promedios y seleccionar el valor de aceptacion mas alto
      itemsproceso.forEach((item: any) => {
        item.aceptacion = item.valoresAceptacion.reduce((a: any, b: any) => a + b) / item.valoresAceptacion.length;
        item.rechazo = item.valoresRechazo.reduce((a: any, b: any) => a + b) / item.valoresRechazo.length;
        item.aceptacion = Number(item.aceptacion.toFixed(2));
        item.rechazo = Number(item.rechazo.toFixed(2));

      });

      //Realizar el similarity measure
      //this._calcularSimilarityMeasure(evaluaciones, itemsproceso, valoresIndividuales);
      evaluaciones.forEach((evaluacion: any) => {
        let individual: any = [];
        let colectiva: any = []
        evaluacion['items'].forEach((item: any) => {
          itemsproceso.forEach((itemprocess: any) => {
            if (itemprocess.iditem == item.idItem) {
              individual.push({
                id: item.idItem,
                membership: item.valorAceptacion,
                nonmembership: item.valorRechazo,
                hesitation: 1 - (item.valorAceptacion + item.valorRechazo)
              })
              colectiva.push({
                id: itemprocess.iditem,
                membership: itemprocess.aceptacion,
                nonmembership: itemprocess.rechazo,
                hesitation: 1 - (itemprocess.aceptacion + itemprocess.rechazo)
              })
            }
          })
        });
        //funcion _servicioSimilarityMeasure 
        let val = this._servicioSimilarityMeasure._getSimilarity(individual, colectiva, individual.length) as number;
        valoresIndividuales.push(val);
        this._actualizarConsensoIndividual(evaluacion.idevaluacion, val);
      });

      //Medida de similitud 
      nivelcosenso = valoresIndividuales.reduce((a: any, b: any) => a + b) / valoresIndividuales.length;
      this._servicioRondas._actualizarRonda(idronda, nivelcosenso);

      const evalColect = {
        idConsenso: idproceso,
        idRonda: idronda,
        items: itemsproceso,
        nivelactual: nivelcosenso,
        evaluacionfinal: false,
        ronda: numeroronda
      }

      //Verifico el nivel de  consenso o si es la ultima ronda
      if ((nivelcosenso >= nivelesperado) || ultimaronda) {
        evalColect.evaluacionfinal = true
      } else {
        evaluaciones.forEach((participante: any) => {
          let record = {
            idConsenso: idproceso,
            idRonda: idronda,
            idparticipante: participante.idparticipante,
            sugerenciasSuitable: [] as any[],
            sugerenciasUnsuitable: [] as any[]
          };
          participante['items'].forEach((item: any) => {
            itemsproceso.forEach((element: any) => {
              if (item.idItem == element.iditem) {
                if (element.aceptacion - item.valorAceptacion > 0) {
                  let aceptacion = {
                    idItem: item.idItem,
                    incrementar: true,
                    valor: Number(element.aceptacion - item.valorAceptacion).toFixed(2),
                    atributos: element.atrAceptacion
                  }
                  record.sugerenciasSuitable.push(aceptacion)
                } else if (element.aceptacion - item.valorAceptacion < 0) {
                  let aceptacion = {
                    idItem: item.idItem,
                    incrementar: false,
                    valor: Number(((element.aceptacion - item.valorAceptacion) * -1).toFixed(2)),
                    atributos: '' //En este caso ya no toma en cuenta los atributos
                  }
                  record.sugerenciasSuitable.push(aceptacion)
                }

                if (element.rechazo - item.valorRechazo > 0) {
                  let rechazo = {
                    idItem: item.idItem,
                    incrementar: true,
                    valor: Number(element.rechazo - item.valorRechazo).toFixed(2),
                    atributos: element.atrRechazo
                  }
                  record.sugerenciasUnsuitable.push(rechazo)
                } else if (element.rechazo - item.valorRechazo < 0) {
                  let rechazo = {
                    idItem: item.idItem,
                    incrementar: false,
                    valor: Number(((element.rechazo - item.valorRechazo) * -1).toFixed(2)),
                    atributos: '' //En este caso ya no toma en cuenta los atributos
                  }
                  record.sugerenciasUnsuitable.push(rechazo)
                }
              }
            });
          });
          this._crearSugerencias(record);
        });
      }
      this._crearEvaluacionColectiva(evalColect);
    }
  }

  private async _filtrarAtributos(array: any, idproceso: any, idronda: any) {
    let unicos: any = [];
    let aux: any = []
    await array.forEach((atributo: any) => {
      let nombre = atributo.atributo.toUpperCase();
      if (!aux.includes(nombre)) {
        aux.push(nombre);
        unicos.push(atributo)
      }
    });

    await unicos.forEach(async (unique: any) => {
      await array.forEach(async (change: any) => {
        if (unique.atributo.toUpperCase() == change.atributo.toUpperCase()) {
          if (unique.id != change.id) {
            //Reemplazo el atributo en la coleccion evaluacion
            await this._recuperarEvaluaciones(idproceso, idronda).pipe(take(1)).toPromise().then((evaluacion) => {
              evaluacion.forEach(async (evaluation: any) => {
                let newitem: any = []
                let removeitem: any = []
                await evaluation['items'].forEach(async (item: any) => {
                  let cambio = false
                  let itemnuevo = {
                    arrayAceptacion: [] as any,
                    arrayRechazo: [] as any,
                    idItem: await item.idItem,
                    valorAceptacion: await item.valorAceptacion,
                    valorRechazo: await item.valorRechazo,
                  }
                  await item.arrayAceptacion.forEach(async (aa: any) => {
                    if (aa === change.id) {
                      cambio = true
                      await itemnuevo.arrayAceptacion.push(unique.id)
                    } else {
                      await itemnuevo.arrayAceptacion.push(aa)
                    }
                  });
                  await item.arrayRechazo.forEach(async (ar: any) => {
                    if (ar === change.id) {
                      cambio = true
                      await itemnuevo.arrayRechazo.push(unique.id)
                    } else {
                      await itemnuevo.arrayRechazo.push(ar)
                    }
                  });
                  //await newitem.push(itemnuevo);
                  if (cambio) {
                    await this._actualizarEvaluacionIndividual(evaluation.idevaluacion, itemnuevo);
                    await this._removerItemEvaluacionIndividual(evaluation.idevaluacion, item);
                    cambio = false;
                  }
                });
              });
            })
            //Elimino repetido
            this._servicioConsenso._eliminarAtributo(change.id)
          }
        }
      });

    });
  }
}
