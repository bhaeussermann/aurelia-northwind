import { autoinject } from 'aurelia-framework';
import { Router, RouteConfig, NavigationInstruction } from 'aurelia-tools';
import { Employee } from 'models/employee';
import { EmployeesService } from 'services/employees-service';

@autoinject
export class EditEmployee {
  isAdd: boolean;
  employee: Employee;
  errorMessage: string;
  firstNameHasFocus = true;
  isSaving = false;

  private router: Router;

  constructor(private service: EmployeesService) { }

  async activate(_params: any, _routeConfig: RouteConfig, navigationInstruction: NavigationInstruction) {
    this.router = navigationInstruction.router;
    const employeeId = +navigationInstruction.params.id;
    this.isAdd = !employeeId;

    if (this.isAdd) {
      this.employee = {
        firstName: null,
        lastName: null,
        title: null,
        birthDate: null
      };
    } else {
      this.employee = await this.service.getEmployee(employeeId);
    }
  }

  cancel() {
    this.router.navigateBack();
  }

  async save() {
    this.errorMessage = null;
    this.isSaving = true;
    try {
      if (this.isAdd) await this.service.addEmployee(this.employee)
      else await this.service.updateEmployee(this.employee);
      this.router.navigateToRoute('employees');
    } catch (error) {
      this.errorMessage = 'Error saving employee: ' + error.message;
      console.error('Error saving employee.', error);
    } finally {
      this.isSaving = false;
    }
  }
}
