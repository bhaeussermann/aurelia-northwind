import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

@autoinject
export class Employees {
  isLoading = true;
  employees: any[];

  constructor(private httpClient: HttpClient) {}

  activate() {
    setTimeout(async () => {
      this.isLoading = true;
      try {
        this.employees = await this.httpClient.fetch('api/employees').then(response => response.json());
      }
      catch (error) {
        console.error('Bad things happened: ' + error.message);
        throw error;
      }
      finally {
        this.isLoading = false;
      }
    });
  }
}
