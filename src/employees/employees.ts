import { autoinject } from 'aurelia-framework';
import { EmployeesService } from 'services/employees-service';

@autoinject
export class Employees {
  isLoading = true;
  errorMessage: string;
  employees: any[];

  constructor(private service: EmployeesService) {}

  activate() {
    setTimeout(async () => {
      this.isLoading = true;
      try {
        this.employees = await this.service.getEmployees();
      }
      catch (error) {
        this.errorMessage = 'Error loading employees: ' + error.message;
        console.error('Error loading employees.', error);
      }
      finally {
        this.isLoading = false;
      }
    });
  }
}
