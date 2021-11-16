import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurarConsensoComponent } from './page/configurar-consenso.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurarConsensoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurarConsensoRoutingModule { }
