export interface Customer {
  id: string;
  name: string;
  cpfCnpj: string;
  birthDate: Date; // ISO string
  phone: string;
  email: string;
  isIndividual: boolean;
  stateRegistration?: string;
  isStateRegistrationExempt: boolean;
  address: {
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}
