import { Routes } from '@angular/router';
import { CustomerListComponent } from './features/customer/components/customer-list/customer-list.component'                                      
import { CustomerFormComponent } from './features/customer/components/customer-form/customer-form.component';

export const routes: Routes = [
  { path: '', component: CustomerListComponent },
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/:id', component: CustomerFormComponent },
  { path: '**', redirectTo: '' }
];
