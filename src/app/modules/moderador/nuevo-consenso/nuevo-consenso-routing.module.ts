import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoConsensoComponent } from './page/nuevo-consenso.component';

const routes: Routes = [
  {
    path: '',
    component: NuevoConsensoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NuevoConsensoRoutingModule { }
