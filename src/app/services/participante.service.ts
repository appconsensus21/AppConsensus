import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilidadServiceService } from './utilidad-service.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteService {

  constructor(
    private _angularFirestore: AngularFirestore,
  ) { }

  public  _recuperarConsensosParticipante(id: string): Observable<any> {
    return this._angularFirestore.collection('proceso_consenso', (ref) => ref.where('id_proceso_consenso', '==', id))
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              id: a.payload.doc.data()['id_proceso_consenso'],
              estado: a.payload.doc.data()['estado'],
              nombre_consenso: a.payload.doc.data()['nombre_consenso'],
              descripcion: a.payload.doc.data()['descripcion'],
              rondas: a.payload.doc.data()['rondas'],
              nivel: a.payload.doc.data()['nivel_consenso'],
              fecha: a.payload.doc.data()['fecha_inicio']
            }
            return data;
          })
        )
      )
  }

  public _recuperarRegistros(id: string): Observable<any> {
    return this._angularFirestore.collection('registro_participante', (ref) => ref.where('uid_participante', '==', id).where('aceptado', '==', true))
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              id: a.payload.doc.data()['id_proceso_consenso'],
            }
            return data;
          })
        )
      )
  }

  public _recuperarItemsParticipante(id: string): Observable<any> {
    return this._angularFirestore.collection('item', (ref) => ref.where('id_proceso_consenso', '==', id))
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              nombre: a.payload.doc.data()['nombre'],
              descripcion: a.payload.doc.data()['descripcion'],
              metadata: a.payload.doc.data()['metadata'],
              foto: a.payload.doc.data()['foto'],
              atributosaceptacion: a.payload.doc.data()['atributosaceptacion'],
              atributosrechazo: a.payload.doc.data()['atributosrechazo'],
              id: a.payload.doc.id
            }
            return data;
          })
        )
      )
  }

  public _recuperarRondaporId(id: string) {
    return this._angularFirestore.collection('ronda_evaluacion').doc(id).get();
  }

  public async _finalizarRonda(id: string) {
    return await this._angularFirestore.collection('ronda_evaluacion').doc(id).update({ 'finalizado': true });
  }

  public async _registrarEvaluacionParticipante(id: string, array: any) {
    this._angularFirestore.collection('ronda_evaluacion').doc(id).update({
      participantes: firebase.firestore.FieldValue.arrayUnion(array)
    });
  }
}
