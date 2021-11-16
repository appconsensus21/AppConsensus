// // @ts-ignore
// function requireHTTPS(req, res, next) {
//   // The 'x-forwarded-proto' check is for Heroku
//   if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
//       return res.redirect('https://' + req.get('host') + req.url);
//   }
//   next();
// }
// // @ts-ignore
// const express = require('express');
// const app = express();
// app.use(requireHTTPS);

// app.use(express.static(`./dist/proyecto-integradora`));

// app.get( `/*`, function(/** @type {any} */ req, /** @type {{ sendFile: (arg0: string, arg1: { root: string; }) => void; }} */ res) {
//   res.sendFile(`index.html`, {root: 'dist/proyecto-integradora/'}
// );
// });

// app.listen(process.env.PORT || 8080);