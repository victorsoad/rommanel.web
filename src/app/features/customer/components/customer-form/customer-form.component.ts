import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.models';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { ageValidator } from '../../../../shared/Validators/age.validator';
import { CepResponse, CepService } from '../../services/cep.service';
import { dateFormatValidator } from '../../../../shared/Validators/dateFormat.validator';



@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxMaskDirective],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],    
})

export class CustomerFormComponent {
  form: FormGroup;
  customerId?: string; 
  isEditMode = false;
  loading = false;
  cpfCnpjMask = '000.000.000-00';
  formSubmitted = false;

  successMessage: string | null = null;
  errorMessages: string[] | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private cepService: CepService
  ) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      cpfCnpj: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      birthDate: ['', [Validators.required, dateFormatValidator()]],
      isIndividual: [true],
      stateRegistration: [''],
      isStateRegistrationExempt: [true],
      zipCode: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    
    this.form.get('cpfCnpj')?.valueChanges.subscribe(value => {
      this.cpfCnpjMask = value && value.length > 11 ? '00.000.000/0000-00' : '000.000.000-00';
    });

    this.form.get('isIndividual')?.valueChanges.subscribe(() => {
      this.applyConditionalValidators();
    });

        this.form.get('isStateRegistrationExempt')?.valueChanges.subscribe(() => {
      this.applyConditionalValidators();
    });

    this.customerId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isEditMode = !!this.customerId;

    if (this.isEditMode) {
      this.loadCustomer();
    }
  }

  loadCustomer() {
  if (!this.customerId) return;

  this.customerService.getCustomerById(this.customerId).subscribe({
    next: (customer: Customer) => {
      const birthDate = customer.birthDate
        ? new Date(customer.birthDate)
        : null;
      const birthFormatted = birthDate
        ? birthDate.toLocaleDateString('pt-BR')
        : '';

      this.form.patchValue({
        ...customer,
        birthDate: birthFormatted
      });
      this.loading = false
    },
    error: (err) => {
      console.error('Erro ao carregar cliente:', err);
      this.loading = false
    }
  });
}


  onSubmit(): void {
    
    this.formSubmitted = true;

    if (this.form.invalid) {      
      this.form.markAllAsTouched();
      return;
    }

    const formValue = {...this.form.value }

    formValue.birthDate = this.parseDateFromString(formValue.birthDate);

    formValue.cpfCnpj = formValue.cpfCnpj.replace(/\D/g, '');
    formValue.phone = formValue.phone.replace(/\D/g, '');
    formValue.zipCode = formValue.zipCode.replace(/\D/g, '');

    const customerData: Customer = formValue;
    
    if (this.isEditMode && this.customerId) {
      console.log(customerData);
      this.customerService.updateCustomer(this.customerId, customerData).subscribe({
        next: () => {
          this.successMessage = 'Cliente atualizado com sucesso!';
          this.router.navigate(['/customers'], { state: { message: 'Cliente atualizado com sucesso!' } });
        },          
        error: (err) => this.handleApiError(err)
      });
    } else {
      this.customerService.createCustomer(customerData).subscribe({
        next: () => {
          this.successMessage = 'Cliente criado com sucesso!';
          this.router.navigate(['/customers'], { state: { message: 'Cliente criado com sucesso!' } });
        },          
        error: (err) => this.handleApiError(err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];  // "YYYY-MM-DD"
  }

  private applyConditionalValidators() {
    const isIndividual = this.form.get('isIndividual')?.value;
    const isExempt = this.form.get('isStateRegistrationExempt')?.value;

    // Validação: IE obrigatório se PJ e não isento
    const stateRegControl = this.form.get('stateRegistration');
    if (!isIndividual && !isExempt) {
      stateRegControl?.setValidators([Validators.required]);
    } else {
      stateRegControl?.clearValidators();
    }
    stateRegControl?.updateValueAndValidity();
  }


  private parseDateFromString(dateStr: string): Date | null {
    if (!dateStr) return null;

    let day: string, month: string, year: string;

    if (dateStr.includes('/')) {
      [day, month, year] = dateStr.split('/');
    } else {
      day = dateStr.slice(0, 2);
      month = dateStr.slice(2, 4);
      year = dateStr.slice(-4);
    }
    // Monta no formato ISO para garantir parsing correto
    const isoString = `${year}-${month}-${day}T00:00:00`;

    const date = new Date(isoString);

    return isNaN(date.getTime()) ? null : date;
  }
  private handleApiError(error: any) {
    if (error.error && error.error.errors && Array.isArray(error.error.errors)) {
      this.errorMessages = error.error.errors;
    } else if (error.message) {
      this.errorMessages = [error.message];
    } else {
      this.errorMessages = ['Ocorreu um erro inesperado. Por favor, tente novamente.'];
    }
  }

  public buscarCep() {
    const cep = this.form.get('zipCode')?.value || '';
    if (cep.replace(/\D/g, '').length === 8) {
      this.cepService.consultarCep(cep).subscribe({
        next: (res: CepResponse) => {
          if (!res.erro) {
            this.form.patchValue({
              street: res.logradouro,
              neighborhood: res.bairro,
              city: res.localidade,
              state: res.uf
            });
          } else {
            alert('CEP não encontrado');
          }
        },
        error: () => alert('Erro ao consultar CEP')
      });
    } else {
      alert('CEP inválido');
    }
  }
}
