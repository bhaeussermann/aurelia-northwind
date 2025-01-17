import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Employee } from 'models/employee';

@autoinject
export class EmployeesService {
  constructor(private httpClient: HttpClient) {}

  async getEmployees(): Promise<Employee[]> {
    const response = await this.httpClient.fetch('api/employees');
    if (response.status === 200) return await response.json();
    throw new Error(await response.text());
  }

  async getEmployee(employeeId: number): Promise<Employee> {
    const response = await this.httpClient.fetch('api/employees/' + employeeId);
    if (response.status === 200) return await response.json();
    throw new Error(await response.text());
  }

  async deleteEmployee(employeeId: number): Promise<void> {
    const response = await this.httpClient.delete('api/employees/' + employeeId);
    if (response.status !== 200) throw new Error(await response.text());
  }

  async addEmployee(employee: Employee): Promise<void> {
    const response = await this.httpClient.post(
      'api/employees',
      JSON.stringify(employee),
      {
        headers: new Headers({
          'content-type': 'application/json'
        })
      }
    );
    if (response.status !== 200) throw new Error(await response.text());
  }

  async updateEmployee(employee: Employee): Promise<void> {
    const response = await this.httpClient.put(
      'api/employees/' + employee.id,
      JSON.stringify(employee),
      {
        headers: new Headers({
          'content-type': 'application/json'
        })
      }
    );
    if (response.status !== 200) throw new Error(await response.text());
  }
}
