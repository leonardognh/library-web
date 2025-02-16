import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('que estou na página de login', () => {
  cy.visit('/login');
});

When('eu insiro {string} no campo de usuário', (login: string) => {
  cy.get('[data-cy=login]').type(login);
});

When('eu insiro {string} no campo de senha', (password: string) => {
  cy.get('[data-cy=password]').type(password);
});

When('eu clico no botão de login', () => {
  cy.get('[data-cy=btn-login]').click();
});

Then('eu devo ser redirecionado para a página inicial', () => {
  cy.url().should('include', '/shop');
});
