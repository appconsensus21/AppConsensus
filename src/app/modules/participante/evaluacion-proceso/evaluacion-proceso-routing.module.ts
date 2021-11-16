import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluacionProcesoComponent } from './page/evaluacion-proceso.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluacionProcesoComponent ,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionProcesoRoutingModule { }
