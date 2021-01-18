/// <reference types="cypress" />

describe('View Employees', () => {
  context('Load', () => {
    before(setupContextPrecondition);

    it('Lists employees', () => {
      cy.get('[data-cy=employees] td:nth-child(1)').then(elements => {
        const names = elements.toArray().map(e => e.innerHTML);
        assert.deepEqual(names, ['Davolio', 'Fuller', 'Leverling']);
      });
      
      cy.get('[data-cy=employees] td:nth-child(2)').then(elements => {
        const names = elements.toArray().map(e => e.innerHTML);
        assert.deepEqual(names, ['Nancy', 'Andrew', 'Janet']);
      });
    });

    it('Shows loading error', () => {
      try {
        cy.route2('GET', 'http://localhost:9000/api/employees', {
          statusCode: 500,
          body: 'Something went wrong'
        }).as('get-employees');
        cy.visit('http://localhost:9000');
        cy.wait('@get-employees');
        cy.get('.error').should('have.text', 'Error loading employees: Something went wrong');
      }
      finally {
        setupContextPrecondition();
      }
    });
  });

  context('View', () => {
    before(setupContextPrecondition);

    beforeEach(() => {
      cy.get('[data-cy=search-textbox]').clear();
    });

    it('Filter', () => {
      cy.get('[data-cy=search-textbox]').type('li');

      cy.get('[data-cy=employees] td:nth-child(1)').then(elements => {
        const names = elements.toArray().map(e => e.innerHTML);
        assert.deepEqual(names, ['Davolio', 'Leverling']);
      });

      cy.get('[data-cy=search-textbox]').type('n');

      cy.get('[data-cy=employees] td:nth-child(1)').then(elements => {
        const names = elements.toArray().map(e => e.innerHTML);
        assert.deepEqual(names, ['Leverling']);
      });
    });

    it('Sort', () => {
      cy.get('[data-cy=first-name-header]').click();

      cy.get('[data-cy=employees] td:nth-child(1)').then(elements => {
        const names = elements.toArray().map(e => e.innerHTML);
        assert.deepEqual(names, ['Fuller', 'Leverling', 'Davolio']);
      });
      cy.get('[data-cy=employees] td:nth-child(2)').then(elements => {
        const names = elements.toArray().map(e => e.innerHTML);
        assert.deepEqual(names, ['Andrew', 'Janet', 'Nancy']);
      });

      cy.get('[data-cy=first-name-header]').click();

      cy.get('[data-cy=employees] td:nth-child(2)').then(elements => {
        const names = elements.toArray().map(e => e.innerHTML);
        assert.deepEqual(names, ['Nancy', 'Janet', 'Andrew']);
      });

      cy.get('[data-cy=last-name-header]').click();

      cy.get('[data-cy=employees] td:nth-child(2)').then(elements => {
        const names = elements.toArray().map(e => e.innerHTML);
        assert.deepEqual(names, ['Nancy', 'Andrew', 'Janet']);
      });
    });
  });
});

function setupContextPrecondition() {
  cy.fixture('get-employees').then(response => {
    cy.route2('GET', 'http://localhost:9000/api/employees', response).as('get-employees');
  });
  cy.visit('http://localhost:9000');
  cy.wait('@get-employees');
}
