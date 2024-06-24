import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConvexHullComponent } from './components/convex-hull/convex-hull.component';

const routes: Routes = [
  {path:'',component:ConvexHullComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
