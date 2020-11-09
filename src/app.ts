import { PLATFORM } from 'aurelia-framework';

export class App {
  configureRouter(config) {
    config.map([
      {
        route: '',
        redirect: 'employees'
      },
      {
        route: [ 'employees' ],
        viewPorts: {
          pageContent: { moduleId: PLATFORM.moduleName('employees/employees') },
        },
        title: 'Employees',
        nav: true 
      }
    ]);
  }
}
