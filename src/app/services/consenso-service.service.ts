import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsensoServiceService {

  constructor(
    private _angularFirestore: AngularFirestore,
  ) { }

  public _recuperarConsensos(id: string) {
    return this._angularFirestore.collection('proceso_consenso', ref => ref.where('id_proceso_consenso', '==', id)).snapshotChanges();
  }

  public _actualizarEstadoConsenso(_id: string, _value: string) {
    let doc = this._angularFirestore.collection('proceso_consenso', ref => ref.where('id_proceso_consenso', '==', _id));
    doc.snapshotChanges().subscribe((res: any) => {
      let id = res[0].payload.doc.id;
      this._angularFirestore.collection('proceso_consenso').doc(id).update({ estado: _value });
    });
  }

  public _actualizarConsenso(id: string, estado: string) {
    return this._angularFirestore.collection('proceso_consenso').doc(id).update({ 'estado': estado })
  }

  public _crearConsenso(record: any) {
    return this._angularFirestore.collection('proceso_consenso').add(record);
  }

  public _crearItem(record: any) {
    return this._angularFirestore.collection('item').add(record);
  }

  public _actualizarItemAtributosAceptacion(id: string, array: any) {
    return this._angularFirestore.collection('item').doc(id).update({ 'atributosaceptacion': firebase.firestore.FieldValue.arrayUnion(array) });
  }

  public _actualizarItemAtributosRechazo(id: string, array: any) {
    return this._angularFirestore.collection('item').doc(id).update({ 'atributosrechazo': firebase.firestore.FieldValue.arrayUnion(array) });
  }

  public _recuperarItem(idItem: any) {
    return this._angularFirestore.collection('item').doc(idItem).get();
  }

  public _recuperarItemsEvaluacion(id: string): Observable<any> {
    return this._angularFirestore.collection('item', (ref) => ref.where('id_proceso_consenso', '==', id))
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              iditem: a.payload.doc.id,
              valoresAceptacion: [],
              valoresRechazo: [],
              atrAceptacion: [],
              atrRechazo: [],
              aceptacion: 0,
              rechazo: 0,
            }
            return data;
          })
        )
      )
  }

  // _recuperarAtributoporId(id: any) {
  //   return this._angularFirestore.collection('atributos').doc(id).get();
  // }

  async _eliminarAtributo(id: string) {
    return this._angularFirestore.collection('atributos').doc(id).delete();
  }

  public _crearAtributo(record: any) {
    return this._angularFirestore.collection('atributos').add(record);
  }

  public _recuperarAtributoporId(id: any) {
    return this._angularFirestore.collection('atributos').doc(id).get();
  }

  // getAttributebyIdProceso(id: any) {
  //   return this._angularFirestore.collection('atributos', ref => ref.where('id_proceso_consenso', '==', id)).snapshotChanges();
  // }

  public _recuperarAtributosporConsensoId(id: any){
    return this._angularFirestore.collection('atributos', (ref) => ref.where('id_proceso_consenso', '==', id))
    .snapshotChanges().pipe(
      map(act =>
        act.map((a:any) =>{
          let  data ={
            id: a.payload.doc.id,
            atributo: a.payload.doc.data().atributo,
            valor: a.payload.doc.data().valor,
          }
          return data;
        })
      )
    )
  }

  public _recuperarAtributoporNombre(name: any) {
    return this._angularFirestore.collection('atributos', ref => ref.where('atributo', '==', name)
      .limit(1)).snapshotChanges();
  }

  public _recuperarConsensoporCodigo(id: string, iduser: any) {
    return this._angularFirestore.collection('registro_participante', ref => ref.where('codigo', '==', id).where('uid_participante', '==', iduser)
      .limit(1)).snapshotChanges();
  }

  public async _actualizarRegistro(id: string) {
    return await this._angularFirestore.collection('registro_participante').doc(id).update({ 'aceptado': true });
  }


}
