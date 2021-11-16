import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RondasService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  public _recuperarRondas(id: string): Observable<any> {
    return this.afs.collection('ronda_evaluacion', (ref) => ref.where('idconsenso', '==', id)
      .where('finalizado', '==', false)
      .orderBy('orden', 'asc')
    )
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              idronda: a.payload.doc.id,
              ronda: a.payload.doc.data()['orden'],
              fechainicioronda: a.payload.doc.data()['fecha_1'],
              fechafinronda: a.payload.doc.data()['fecha_2'],
              participantes: a.payload.doc.data()['participantes'],
              nivel: a.payload.doc.data()['nivelconsenso'],
            }
            return data;
          })
        )
      )
  }

  public recuperarRonda(id: string): Observable<any> {
    return this.afs.collection('ronda_evaluacion', (ref) => ref.where('idconsenso', '==', id)
      .where('finalizado', '==', false)
      .orderBy('orden', 'asc')
      .limit(1)
    )
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              idronda: a.payload.doc.id,
              ronda: a.payload.doc.data()['orden'],
              fechainicioronda: a.payload.doc.data()['fecha_1'],
              fechafinronda: a.payload.doc.data()['fecha_2'],
              participantes: a.payload.doc.data()['participantes'],
              nivel: a.payload.doc.data()['nivelconsenso'],
            }
            return data;
          })
        )
      )
  }

  public _recuperarRondasEnResultados(id: string): Observable<any> {
    return this.afs.collection('ronda_evaluacion', (ref) => ref.where('idconsenso', '==', id)
      .orderBy('orden', 'asc')
    )
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              idronda: a.payload.doc.id,
              ronda: a.payload.doc.data()['orden'],
              nivel: a.payload.doc.data()['nivelconsenso'],
            }
            return data;
          })
        )
      )
  }

  public _recuperarRondaPrevia(idConsenso: any, orden: any) {
    return this.afs.collection('ronda_evaluacion', (ref) => ref.where('idconsenso', '==', idConsenso).where('orden', '==', orden))
      .snapshotChanges().pipe(
        map(act =>
          act.map((a: any) => {
            return a.payload.doc.id;
          })
        )
      );
  }

  public _recuperarEstadoRonda(idConsenso: any, orden: any) {
    return this.afs.collection('ronda_evaluacion', (ref) => ref.where('idconsenso', '==', idConsenso).where('orden', '==', orden))
      .snapshotChanges().pipe(
        map(act =>
          act.map((a: any) => {
            return a.payload.doc.data()['finalizado'];
          })
        )
      );
  }

  // public getParticipantesPrevRonda(idConsenso: any, orden: any) {
  //   return this.afs.collection('ronda_evaluacion', (ref) => ref.where('idconsenso', '==', idConsenso).where('orden', '==', orden))
  //     .snapshotChanges().pipe(
  //       map(act =>
  //         act.map((a: any) => {
  //           return a.payload.doc.data()['participantes'];
  //         })
  //       )
  //     );
  // }

  public _actualizarRonda(id: any, nivel: any) {
    return this.afs.collection('ronda_evaluacion').doc(id).update({ 'nivelconsenso': nivel })
  }

}
