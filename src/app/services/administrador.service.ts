import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilidadServiceService } from './utilidad-service.service';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  constructor(
    private _servicioUtilidad: UtilidadServiceService,
    private _angularFirestore: AngularFirestore,
    private _servicioNotificacion: ToastrService,
    private _servicioUsuario: UsuarioService
  ) { }

  /**
   * 
   * @param nombres nombres del moderador
   * @param apellidos apellidos del moderador
   * @param email correo electronico del moderador
   */
  async _agregarModerador(nombres: string, apellidos: string, email: string) {
    const pswd = this._servicioUtilidad._generaPassword();
    const newUser = {
      apellidos,
      email,
      nombres,
      pswd,
      rol: 'moderador',
      id_usuario: this._servicioUtilidad._generarId(),
      uid: ''
    }
    var second = firebase.initializeApp(environment.firebaseConfig, pswd);
    await second.auth().createUserWithEmailAndPassword(email, pswd)
      .then((userCredential: any) => {
        newUser.uid = userCredential.user.uid;
        second.auth().signOut();
        this._servicioUsuario._crearUsuario(userCredential.user.uid, newUser)
          .then(() => {
            second.delete();
            this._servicioNotificacion.success('Moderador registrado', '¡Éxito!');
          });
      }).catch((error) => {
        second.delete();
        if (error.code == 'auth/email-already-in-use') {
          const user = this._recuperarUsuariosNoModeradores(email);
          user.subscribe((usuario) => {
            if (usuario[0] != undefined) {
              this._cambiarARolModerador(usuario[0].uid).then(async () => {
                const newModerador = {
                  url: 'https://integradora-proyect-df8b7.web.app',
                  email,
                  mensaje: `Estimado(a) ${nombres} ${apellidos}, ha sido designado como moderador en App Consensus.`
                }
                await this._angularFirestore.collection('reportMail').add(newModerador).then(res => {
                  this._servicioNotificacion.info('Participante ha sido designado como moderador');
                }).catch(() => {
                  this._servicioNotificacion.error('Participante no ha sido designado como moderador', 'Error');
                })
              })
            } else {
              this._servicioNotificacion.warning('Moderador ya se encuentra registrado');
            }
          })
        } else {
          this._servicioNotificacion.error('Ha ocurrido un error en el sistema');
        }
      });
  }

  /**
   * Se obtiene un array de elementos con informacion de usuario participante
   * elemento = {
   *  nombre,
   *  email,
   *  activo
   * }
   */
  public _recuperarModeradores(): Observable<any> {
    return this._angularFirestore.collection('usuario', (ref) => ref.where('rol', '==', 'moderador'))
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              nombre: a.payload.doc.data()['nombres'] + ' ' + a.payload.doc.data()['apellidos'],
              email: a.payload.doc.data()['email'],
              activo: true
            }
            return data;
          })
        )
      )
  }

  /**
   * Se obtienen todos los procesos de consenso del sistema
   */
  public _recuperarConsensosAdministrador(): Observable<any> {
    return this._angularFirestore.collection('proceso_consenso')
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              id: a.payload.doc.data()['id_proceso_consenso'],
              estado: a.payload.doc.data()['estado'],
              nombre_consenso: a.payload.doc.data()['nombre_consenso'],
              descripcion: a.payload.doc.data()['descripcion'],
            }
            return data;
          })
        )
      )
  }

  private async _recuperarUsuarios() {
    return this._angularFirestore.collection('usuario', (ref) => ref.where('rol', '!=', 'administrador'))
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              email: a.payload.doc.data()['email'],
            }
            return data;
          })
        )
      )
  }

  /**
   * Envia una notificacion a todos los usuarios del sistema
   * @param asunto 
   * @param mensaje 
   */
  public async _enviarNotificacionTodos(asunto: any, mensaje: any) {
    let error = false;
    let user = (await this._recuperarUsuarios()).pipe(take(1)).toPromise();
    user.then((res: any) => {
      res.forEach((element: any) => {
        const data = {
          asunto,
          mensaje,
          email: element['email']
        }
        this._angularFirestore.collection('notificaciones').add(data).catch((err) => {
          error = true;
        });
      });

    }).catch(() => {
      this._servicioNotificacion.error('Ha ocurrido un error en el sistema')
    }).finally(() => {
      if (error) {
        this._servicioNotificacion.error('Ha ocurrido un error al enviar la notificación')
      } else {
        this._servicioNotificacion.success('Notificaciones enviadas')
      }
    })
  }

  /**
   * Envia una notificacion a todos los usuarios moderadores del sistema
   * @param asunto 
   * @param mensaje 
   */
  public async _enviarNotificacionAModeradores(asunto: any, mensaje: any) {
    let error = false;
    let user = (this._recuperarModeradores()).pipe(take(1)).toPromise();
    user.then((res: any) => {
      res.forEach((element: any) => {
        const data = {
          asunto,
          mensaje,
          email: element['email']
        }
        this._angularFirestore.collection('notificaciones').add(data).catch((err) => {
          error = true;
        });
      });
    }).catch(() => {
      this._servicioNotificacion.error('Ha ocurrido un error en el sistema')
    }).finally(() => {
      if (error) {
        this._servicioNotificacion.error('Ha ocurrido un error al enviar la notificación')
      } else {
        this._servicioNotificacion.success('Notificaciones enviadas')
      }
    })
  }

  /**
   * Envia una notificacion a todos los usuarios participantes del sistema
   * @param asunto 
   * @param mensaje 
   */
  public async _enviarNotificacionAParticipantes(asunto: any, mensaje: any) {
    let error = false;
    let user = (this._recuperarParticipantes()).pipe(take(1)).toPromise();
    user.then((res: any) => {
      res.forEach((element: any) => {
        const data = {
          asunto,
          mensaje,
          email: element['email']
        }
        this._angularFirestore.collection('notificaciones').add(data).catch((err) => {
          error = true;
        });
      });
    }).catch(() => {
      this._servicioNotificacion.error('Ha ocurrido un error en el sistema')
    }).finally(() => {
      if (error) {
        this._servicioNotificacion.error('Ha ocurrido un error al enviar la notificación')
      } else {
        this._servicioNotificacion.success('Notificaciones enviadas')
      }
    })
  }

  private _recuperarUsuariosNoModeradores(correo: string) {
    return this._angularFirestore.collection('usuario', (ref) => ref.where('rol', '==', 'participante').where('email', '==', correo))
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              nombre: a.payload.doc.data()['nombres'] + ' ' + a.payload.doc.data()['apellidos'],
              email: a.payload.doc.data()['email'],
              uid: a.payload.doc.data()['uid']
            }
            return data;
          })
        )
      )
  }

  private _cambiarARolModerador(id: string) {
    return this._angularFirestore.collection('usuario').doc(id).update({ 'rol': 'moderador' })
  }

  private _recuperarParticipantes() {
    return this._angularFirestore.collection('usuario', (ref) => ref.where('rol', '==', 'participante'))
      .snapshotChanges()
      .pipe(
        map(act =>
          act.map((a: any) => {
            let data = {
              email: a.payload.doc.data()['email']
            }
            return data;
          })
        )
      )
  }
}
