// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { firebaseConfig } from "./config/firebaseConfig";
import { menuItemsAdministrador } from "./config/menuItemsAdministrador";
import { menuItemsModerador } from "./config/menuItemsModerador";
import { menuItemsParticipante } from "./config/menuItemsParticipante";

export const environment = {
  production: false,
  firebaseConfig: firebaseConfig,
  menuItemsAdministrador: menuItemsAdministrador,
  menuItemsModerador: menuItemsModerador,
  menuItemsParticipante: menuItemsParticipante
};

