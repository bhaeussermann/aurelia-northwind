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
}
