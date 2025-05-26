export interface Customer {
  id: string;
  name: string;
  cpfCnpj: string;
  birthDate: string;
  phone: string;
  email: string;
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  isIndividual: boolean;
  stateRegistration: string;
  isStateRegistrationExempt: boolean;
}

export interface PagedResult<T> {
  customers: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}
