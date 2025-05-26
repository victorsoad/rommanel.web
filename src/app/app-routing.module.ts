import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { customerRoutes } from './features/customer/customer-routing';

const routes: Routes = [
  {
    path: 'customers',
    children: customerRoutes
  },
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: '**', redirectTo: 'customers' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
