import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.models';
import { TelefoneFormatPipe } from '../../../../shared/pipes/telefone-format.pipe';
import { CpfCnpjFormatPipe } from '../../../../shared/pipes/cpf-cnpj-format-pipe';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TelefoneFormatPipe, CpfCnpjFormatPipe],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(private customerService: CustomerService, private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state && navigation.extras.state['message']) {
        this.successMessage = navigation.extras.state['message'];
      }

    this.loadCustomers();
  }

  loadCustomers() {
    this.error = null;
    this.customerService.getCustomers(this.pageNumber, this.pageSize)
      .pipe(
        catchError(err => {
          this.error = 'Erro ao carregar clientes.';
          return of({ customers: [], pageNumber: 1, pageSize: 10, totalRecords: 0, totalPages: 1 });
        })
      )
      .subscribe(response => {
        this.customers = response.customers;
        this.pageNumber = response.pageNumber;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
      });
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadCustomers();
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadCustomers();
    }
  }

  createCustomer() {    
    this.router.navigate(['/customers/new']);
  }

  editCustomer(id: string) {
    this.router.navigate([`/customers/${id}`]);
  }

  onDelete(id: string, event: Event): void {
    event.stopPropagation(); // evita disparar o goToEdit ao clicar no botão

    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          alert('Cliente deletado com sucesso!');
          this.loadCustomers(); // recarrega a lista
        },
        error: (err) => {
          console.error('Erro ao deletar cliente', err);
          alert('Erro ao deletar cliente.');
        }
      });
    }
  }
}
