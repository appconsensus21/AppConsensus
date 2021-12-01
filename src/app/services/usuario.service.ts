import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private _angularFirestore: AngularFirestore,
    private _firebaseAuth: AngularFireAuth,
    private _router: Router,
    private _servicioNotificacion: ToastrService,
  ) { }

  public unsubscribe(){
    firebase.firestore().disableNetwork();
  }

  public subscribe(){
    firebase.firestore().enableNetwork();
  }

  public logout(mostrar: boolean){
    this._firebaseAuth.signOut().finally(()=>{
      if(mostrar){
        this._servicioNotificacion.info('Sesión cerrada correctamente', '¡Hasta Luego!');
      }
      this._router.navigate(['/login']);
    })
  }
  
  public async _crearUsuario(id: any, data: any) {
    data.uid = id;
    return await firebase.firestore().collection('usuario').doc(id).set(data);
  }

  private _recuperarUsuario() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((userData) => {
        if (userData) {
          resolve(userData);
        } else {
          reject(false);
        }
      });
    });
  }

  private _recuperarIdUsuario(id: string) {
    return firebase.firestore().collection('usuario').where('uid', '==', id);
  }

  public async _recuperarDataUsuario() {
    return new Promise((resolve, reject) => {
      this._recuperarUsuario()
        .then((userData: any) => {
          this._recuperarIdUsuario(userData['uid'])
            .get()
            .then((collection) => {
              collection.forEach((doc) => {
                resolve(doc.data());
              });
            });
        })
        .catch(() => {
          reject(null);
        });
    });
  }

  public async _actualizarPswd(newPassword: string) {
    const user = await this._firebaseAuth.currentUser;
    return await user?.updatePassword(newPassword);
  }

  public async _actualizarUsuario() {
    const user = await this._firebaseAuth.currentUser;
    return await this._angularFirestore.collection('usuario').doc(user?.uid).update({ 'pswd': '' });
  }

  public async _crearUsuarioParticipante(nombres: string, apellidos: string, email: string, pswd: string) {
    const newUser = {
      apellidos,
      email,
      nombres,
      pswd: '',
      rol: 'participante',
      id_usuario: '',
      uid: ''
    }
    await firebase.auth().createUserWithEmailAndPassword(email, pswd).then((userCredential: any) => {
      this._crearUsuario(userCredential.user.uid, newUser).then(() => {
        this._servicioNotificacion.success('Registro de participante exitoso')
        this._router.navigate(['/login']);
      }).catch(() => {
        this._servicioNotificacion.error('Ha ocurrido un error en el sistema');
      })
    }).catch((error) => {
      if (error.code == 'auth/email-already-in-use') {
        this._servicioNotificacion.warning('Esta cuenta ya se encuentra registrada');
      } else {
        this._servicioNotificacion.error('Ha ocurrido un error en el sistema');
      }
    })
  }
}
