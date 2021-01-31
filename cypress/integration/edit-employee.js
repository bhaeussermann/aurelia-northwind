/// <reference types="cypress" />

import { getApplicationUrl, getApiUrl } from '../support/url-helpers';

describe('Edit Employee', () => {
  context('Add', () => {
    beforeEach(() => {
      setupContextPrecondition();
      cy.get('[data-cy=add-button]').click();
    });

    it('Shows \'Add Employee\' page', () => {
      cy.get('h1').should('have.text', 'Add Employee');
    });

    it('Cancel goes back to overview', () => {
      cy.get('[data-cy=cancel-button]').click();
      cy.get('.title').should('have.text', 'Employees');
    });

    it('Leaving fields blank shows validations', () => {
      cy.get('[data-cy=save-button]').click();
      cy.get('h1').should('have.text', 'Add Employee');
    });

    it('First name field should have focus', () => {
      cy.get('#first-name').should('have.focus');
    });

    it('Add successfully', () => {
      cy.route2('POST', getApiUrl('employees'), {}).as('add-employee');

      fillForm();
      cy.get('[data-cy=save-button]').click();

      cy.wait('@add-employee');
      cy.get('.title').should('have.text', 'Employees');
    });

    it('Failure while adding shows error', () => {
      cy.route2('POST', getApiUrl('employees'), { 
        statusCode: 500,
        body: 'Something went wrong'
      }).as('add-employee');

      fillForm();
      cy.get('[data-cy=save-button]').click();

      cy.wait('@add-employee');
      cy.get('.error').should('have.text', 'Error saving employee: Something went wrong');
    });
  });
});

function setupContextPrecondition() {
  setupRoutes();
  cy.visit(getApplicationUrl());
  cy.wait('@get-employees');
}

function setupRoutes() {
  cy.fixture('get-employees').then(response => {
    cy.route2('GET', getApiUrl('employees'), response).as('get-employees');
  });
}

function fillForm() {
  cy.get('#first-name').type('Qwfp');
  cy.get('#last-name').type('Arst');
  cy.get('#title').type('Cool Guy');
}
