import { autoinject } from 'aurelia-framework';
import { Employee } from 'models/employee';
import { EmployeesService } from 'services/employees-service';
import { SortOrder, SortService } from 'services/sort-service';

@autoinject
export class Employees {
  isLoading = true;
  errorMessage: string;

  employees: Employee[];
  displayedEmployees: Employee[];

  get searchText() {
    return this._searchText;
  }
  set searchText(newValue: string) {
    this._searchText = newValue;
    this.refreshFilteredEmployees();
  }
  _searchText: string;

  get lastNameColumnClass() {
    return this.getClassesForColumn('lastName');
  }

  get firstNameColumnClass() {
    return this.getClassesForColumn('firstName');
  }

  get titleColumnClass() {
    return this.getClassesForColumn('title');
  }

  constructor(private service: EmployeesService, private sortService: SortService) {
    this.sortService.toggleColumn('lastName');
  }

  activate() {
    setTimeout(async () => {
      this.isLoading = true;
      try {
        this.displayedEmployees = this.employees = await this.service.getEmployees();
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

  toggleColumn(columnName: string) {
    this.sortService.toggleColumn(columnName);
    this.refreshFilteredEmployees();
  }

  private refreshFilteredEmployees() {
    const filteredEmployees = !this.searchText 
      ? this.employees 
      : this.employees.filter(e => 
        e.lastName.toLowerCase().includes(this.searchText.toLowerCase())
        || e.firstName.toLowerCase().includes(this.searchText.toLowerCase())
        || e.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
    this.displayedEmployees = filteredEmployees.sort((a, b) => {
      const valueA = a[this.sortService.sortedColumn], valueB = b[this.sortService.sortedColumn];
      const comparisonValue = valueA < valueB ? -1 : (valueA > valueB ? 1 : 0);
      return this.sortService.sortOrder === SortOrder.Ascending ? comparisonValue : -comparisonValue;
    });
  }

  private getClassesForColumn(columnName: string): string {
    return 'sortable ' + this.getSortClassForColumn(columnName);
  }

  private getSortClassForColumn(columnName: string): string {
    if (this.sortService.sortedColumn !== columnName) return '';
    return this.sortService.sortOrder === SortOrder.Ascending ? 'sort-arrow up' : 'sort-arrow down';
  }
}
