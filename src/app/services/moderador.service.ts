import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UtilidadServiceService } from './utilidad-service.service'
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})

export class ModeradorService {

  constructor(
    private _angularFirestore: AngularFirestore,
    private _servicioNotificacion: ToastrService,
    private _servicioUtilidad: UtilidadServiceService,
    private _servicioUsuario: UsuarioService
  ) { }

  public _recuperarConsensosModerador(id: string): Observable<any> {
    return this._angularFirestore.collection('proceso_consenso', (ref) => ref.where('id_moderador', '==', id))
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
              currentronda: '' as any,
            }
            return data;
          })
        )
      )
  }

  public _recuperarItems(id: string): Observable<any> {
    return this._angularFirestore.collection('item', (ref) => ref.where('id_proceso_consenso', '==', id))
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              nombre: a.payload.doc.data()['nombre'],
              descripcion: a.payload.doc.data()['descripcion'],
              id: a.payload.doc.id
            }
            return data;
          })
        )
      )
  }

  public _recuperarAtributos(id: string): Observable<any> {
    return this._angularFirestore.collection('atributos', (ref) => ref.where('id_proceso_consenso', '==', id))
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              atributo: a.payload.doc.data()['atributo'],
              descripcion: a.payload.doc.data()['valor'],
              id: a.payload.doc.id
            };
            return data;
          }))
      )
  }

  public async _eliminarItem(id: string) {
    return this._angularFirestore.collection('item').doc(id).delete();
  }

  public _eliminarAtributo(id: string) {
    return this._angularFirestore.collection('atributos').doc(id).delete();
  }

  public _recuperarParticipantes(): Observable<any> {
    return this._angularFirestore.collection('usuario', (ref) => ref.where('rol', '==', 'participante'))
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              nombres: a.payload.doc.data()['nombres'],
              apellidos: a.payload.doc.data()['apellidos'],
              correo: a.payload.doc.data()['email'],
              uid: a.payload.doc.data()['uid']
            }
            return data;
          })
        )
      )
  }

  public async _recuperarParticipanteporCorreo(correo: string){
    return this._angularFirestore.collection('usuario', (ref) => ref.where('email', '==', correo))
    .snapshotChanges()
    .pipe(
      map(act =>
        act.map((a: any) => {
          let data = {
            nombres: a.payload.doc.data()['nombres'],
            apellidos: a.payload.doc.data()['apellidos'],
            email: a.payload.doc.data()['email'],
            uid: a.payload.doc.data()['uid'],
            rol: a.payload.doc.data()['rol'],
          }
          return data;
        })
      )
    )
  }

  public _recuperarParcipantesConsenso(id: string): Observable<any> {
    return this._angularFirestore.collection('registro_participante', (ref) => ref.where('id_proceso_consenso', '==', id))
    .snapshotChanges()
    .pipe(
      map(act =>
        act.map((a: any) => {
          let data = {
            nombres: a.payload.doc.data()['nombres'],
            apellidos: a.payload.doc.data()['apellidos'],
            estado: a.payload.doc.data()['aceptado'],
          }
          return data;
        })
      )
    )
  }

  public _enviarInvitacion(record:any){
    return this._angularFirestore.collection('registro_participante').add(record);
  }

  public _generarRonda(record: any){
    return this._angularFirestore.collection('ronda_evaluacion').add(record);
  }

  public _iniciarConsenso(id: string) {
    return this._angularFirestore.collection('proceso_consenso').doc(id).update({ 'estado': 'iniciado' })
  }

  public _actualizarParticipantesConsenso(id: string,num: any){
    return this._angularFirestore.collection('proceso_consenso').doc(id).update({ 'participantes_totales': num })
  }

  public async _verificarParticipante(user: any) {
    return  this._angularFirestore.collection('usuario', (ref) => ref.where('email', '==', user.correo)).snapshotChanges()
  }
  
  public async _crearParticipante(nombres: string, apellidos: string, email: string) {
    const pswd = this._servicioUtilidad._generaPassword();
    const newUser = {
      apellidos,
      email,
      nombres,
      pswd,
      rol: 'participante',
      id_usuario: this._servicioUtilidad._generarId(),
      uid: ''
    }
    let second = firebase.initializeApp(environment.firebaseConfig, pswd);
    let userCredentialPromisse =  (await second.auth().createUserWithEmailAndPassword(email,pswd))
    //newUser.uid = userCredentialPromisse.user?.uid as string
    this._servicioUsuario._crearUsuario(userCredentialPromisse.user?.uid, newUser).catch(()=>{
      this._servicioNotificacion.error('Ha ocurrido un error en el sistema');
    })
  
      await second.delete();
  }

}
