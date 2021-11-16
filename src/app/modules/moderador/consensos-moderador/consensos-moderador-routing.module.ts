import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsensosModeradorComponent } from './page/consensos-moderador.component';

const routes: Routes = [
  {
    path: '',
    component: ConsensosModeradorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsensosModeradorRoutingModule { }
