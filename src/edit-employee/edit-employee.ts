import { autoinject } from 'aurelia-framework';
import { Router, RouteConfig, NavigationInstruction } from 'aurelia-tools';
import { Employee } from 'models/employee';
import { EmployeesService } from 'services/employees-service';

@autoinject
export class EditEmployee {
  employee: Employee;
  errorMessage: string;
  firstNameHasFocus = true;
  isSaving = false;

  private router: Router;

  constructor(private service: EmployeesService) { }

  activate(_params: any, _routeConfig: RouteConfig, navigationInstruction: NavigationInstruction) {
    this.router = navigationInstruction.router;
    this.employee = {
      firstName: null,
      lastName: null,
      title: null,
      birthDate: null
    };
  }

  cancel() {
    this.router.navigateBack();
  }

  async save() {
    this.errorMessage = null;
    this.isSaving = true;
    try {
      await this.service.saveChanges(this.employee);
      this.router.navigateToRoute('employees');
    } catch (error) {
      this.errorMessage = 'Error saving employee: ' + error.message;
      console.error('Error saving employee.', error);
    } finally {
      this.isSaving = false;
    }
  }
}
