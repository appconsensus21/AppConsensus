import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModeradoresComponent } from './page/moderadores.component';

const routes: Routes = [
  {
    path: '',
    component: ModeradoresComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModeradoresRoutingModule { }
