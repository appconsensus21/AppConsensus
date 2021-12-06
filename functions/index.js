const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require('cors')({ origin: true });
admin.initializeApp();
require('dotenv').config();

const { SENDER_EMAIL, SENDER_PASSWORD, APP_URL } = process.env;

exports.sendEmailCambioaModerador = functions.firestore.document('reportMail/{doc}')
  .onCreate((snap, ctx) => {
    const data = snap.data();

    let authData = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD
      }
    });
    authData.sendMail({
      from: '"AppConsensus"',
      to: `${data.email}`,
      subject: 'AppConsensus Moderador',
      text: `${data.email}`,
      html: `
      <!DOCTYPE html>
        <html>
        <head>
        </head>
        <body>
        <div class="py-5 container">
          <div class="row py-lg-5">
            <div class="col-lg-6 col-md-8 mx-auto">
              <h1 class="font-weight-bold text-center" align="center" style="margin-bottom: 40px;">App Consensus</h1>
              <p class=" text-muted">
                ${data.mensaje}
              </p>
              <p class="text-center" align="center">
              <a target="_blank" href="${APP_URL}" style="border: none;
              color: white;
              padding: 15px 32px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              margin: 4px 2px;
              cursor: pointer;
              background-color: #182b4d;" >
              <button class="button">Ingresar a la aplicación</button>
              </a>
              </p>
              <p>
                Si no funciona, copie el siguiente link en su navegador:
              </p>
              <p>${APP_URL}</p>
              <p>Saludos,</p>
              <p>App Consensus Team.</p>
            </div>
          </div>
        </div>
        </body>
</html>`
    }).catch(err => console.log(err));
  });

exports.sendEmailNewModerador = functions.firestore.document('usuario/{docId}')
  .onCreate((snap, ctx) => {
    const data = snap.data();

    let authData = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD
      }
    });
    authData.sendMail({
      from: '"AppConsensus"',
      to: `${data.email}`,
      subject: `AppConsensus: Nuevo ${data.rol}`,
      text: `${data.email}`,
      html: `
        <div class="py-5 container">
          <div class="row py-lg-5">
            <div class="col-lg-6 col-md-8 mx-auto">
              <h1 class="font-weight-bold text-center" align="center" style="margin-bottom: 40px;">App Consensus</h1>
              <p class=" text-muted">
                Estimado(a) ${data.nombres} ${data.apellidos}, ha sido designado como ${data.rol} en App Consensus. Porfavor
                ingresar a la aplicación con la contraseña temporal enviada e inmediatamente realizar
                el cambio de la misma.
              </p>
              <p style="margin-bottom: 0rem;">
                <b>Correo electrónico: </b> ${data.email}
              </p>
              <p>
                <b>Contraseña temporal: </b> ${data.pswd}
              </p>
              <p class="text-center" align="center">
              <a href="${APP_URL}"><button class="button" style="border: none;
              color: white;
              padding: 15px 32px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              margin: 4px 2px;
              cursor: pointer;
              background-color: #182b4d;">Cambiar
              contraseña</button>
              </a>
              </p>
              <p>
                Si no funciona, copie el siguiente link en su navegador:
              </p>
              <p>
              ${APP_URL}
              </p>
              <p>Saludos,</p>
              <p>App Consensus Team.</p>
            </div>
          </div>
        </div>`
    }).catch(err => console.log(err));
  })


  exports.sendEmailNewProceso = functions.firestore.document('registro_participante/{docId}')
  .onCreate((snap, ctx) => {
    const data = snap.data();

    let authData = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD
      }
    });
    authData.sendMail({
      from: '"AppConsensus"',
      to: `${data.email}`,
      subject: `AppConsensus: Invitación a nuevo proceso de consenso`,
      text: `${data.email}`,
      html: `
        <div class="py-5 container">
          <div class="row py-lg-5">
            <div class="col-lg-6 col-md-8 mx-auto">
              <h1 class="font-weight-bold text-center" align="center" style="margin-bottom: 40px;">App Consensus</h1>
              <p class=" text-muted">
                Estimado(a) ${data.nombres} ${data.apellidos}, ha sido invitado a un nuevo proceso de consenso en App Consensus. 
              </p>
              <p style="margin-bottom: 0rem;">
                <b>Código del proceso de consenso: </b> ${data.codigo}
              </p>
              <p class="text-center" align="center">
              <a href="${APP_URL}"><button class="button" style="border: none;
              color: white;
              padding: 15px 32px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              margin: 4px 2px;
              cursor: pointer;
              background-color: #182b4d;">Ingresar a proceso de consenso</button>
              </a>
              </p>
              <p>
                Si no funciona, copie el siguiente link en su navegador:
              </p>
              <p>
              ${APP_URL}
              </p>
              <p>Saludos,</p>
              <p>App Consensus Team.</p>
            </div>
          </div>
        </div>`
    }).catch(err => console.log(err));
  })

  exports.sendEmailNotificacion = functions.firestore.document('notificaciones/{docId}')
  .onCreate((snap, ctx) => {
    const data = snap.data();

    let authData = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD
      }
    });
    authData.sendMail({
      from: '"AppConsensus"',
      to: `${data.email}`,
      subject: `${data.asunto}`,
      text: `${data.email}`,
      html: `
        <div class="py-5 container">
          <div class="row py-lg-5">
            <div class="col-lg-6 col-md-8 mx-auto">
              <h1 class="font-weight-bold text-center" align="center" style="margin-bottom: 40px;">App Consensus</h1>
              <p class=" text-muted">
                ${data.mensaje} 
              </p>
              <p>Saludos,</p>
              <p>App Consensus Team.</p>
            </div>
          </div>
        </div>`
    }).catch(err => console.log(err));
  });
