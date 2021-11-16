import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsensoComponent } from './page/consenso.component';

const routes: Routes = [
  {
    path: '',
    component: ConsensoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsensosRoutingModule { }
