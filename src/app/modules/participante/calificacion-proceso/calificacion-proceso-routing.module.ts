import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalificacionProcesoComponent } from './page/calificacion-proceso.component';

const routes: Routes = [
  {
    path: '',
    component: CalificacionProcesoComponent ,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalificacionProcesoRoutingModule { }
