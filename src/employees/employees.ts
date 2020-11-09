import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

@autoinject
export class Employees {
  employees: any[]

  constructor(private httpClient: HttpClient) {}

  async activate() {
    try {
      const data = await this.httpClient.fetch('api/employees').then(response => response.json());
      this.employees = data;
    }
    catch (error) {
      console.error('Bad things happened: ' + error.message);
      throw error;
    }
  }
}
