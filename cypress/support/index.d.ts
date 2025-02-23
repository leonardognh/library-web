// cypress/support/index.d.ts

/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in the user.
     * @example cy.login('usuario123', 'senha123')
     */
    login(login: string, password: string): Chainable<void>;
  }
}
