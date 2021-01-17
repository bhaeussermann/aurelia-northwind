import { autoinject } from 'aurelia-framework';
import { Employee } from 'models/employee';
import { EmployeesService } from 'services/employees-service';

@autoinject
export class Employees {
  isLoading = true;
  errorMessage: string;

  employees: Employee[];
  filteredEmployees: Employee[];

  get searchText() {
    return this._searchText;
  }
  set searchText(newValue: string) {
    this._searchText = newValue;
    this.refreshFilteredEmployees();
  }
  _searchText: string;

  constructor(private service: EmployeesService) {}

  activate() {
    setTimeout(async () => {
      this.isLoading = true;
      try {
        this.filteredEmployees = this.employees = await this.service.getEmployees();
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

  refreshFilteredEmployees() {
    this.filteredEmployees = this.employees
      .filter(e => 
        e.lastName.toLowerCase().includes(this.searchText.toLowerCase())
        || e.firstName.toLowerCase().includes(this.searchText.toLowerCase())
        || e.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
  }
}
