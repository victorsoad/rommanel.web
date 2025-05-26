import { Routes } from '@angular/router';

export const customerRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/customer-list/customer-list.component').then(m => m.CustomerListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./components/customer-form/customer-form.component').then(m => m.CustomerFormComponent)
  }
];
