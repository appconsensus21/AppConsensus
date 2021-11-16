import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProcesosComponent } from './page/lista-procesos.component';

const routes: Routes = [
  {
    path: '',
    component: ListaProcesosComponent ,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaProcesosRoutingModule { }
