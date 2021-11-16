import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilidadServiceService {

  constructor(
  ) { }

  // doRegister(email: string, password: string) {
  //   return firebase.auth().createUserWithEmailAndPassword(email, password);
  // }

  // async createNewParticipante(id: any, data: any, con: any) {
  //   return await con.firestore().collection('usuario').doc(id).set(data);
  // }

  public _generarId() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < charactersLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public _generaPassword() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

}
