import { PLATFORM } from 'aurelia-framework';

export class App {
  configureRouter(config) {
    config.map([
      {
        route: '',
        redirect: 'employees'
      },
      {
        name: 'employees',
        route: [ 'employees' ],
        viewPorts: {
          pageContent: { moduleId: PLATFORM.moduleName('employees/employees') },
        },
        title: 'Employees'
      },
      {
        name: 'add-employee',
        route: [ 'employees/add' ],
        viewPorts: {
          pageContent: { moduleId: PLATFORM.moduleName('edit-employee/edit-employee') },
        },
        title: 'Add Employee'
      }
    ]);
  }
}
