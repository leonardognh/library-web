/// <reference types="cypress" />

Cypress.Commands.add('login', (login: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-cy=login]').type(login);
  cy.get('[data-cy=password]').type(password);
  cy.get('[data-cy=btn-login]').click();
});
