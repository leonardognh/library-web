import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('que estou na página de login', () => {
  cy.visit('/login');
});

When('eu insiro {string} no campo de usuário', (username: string) => {
  cy.get('#username').type(username);
});

When('eu insiro {string} no campo de senha', (password: string) => {
  cy.get('#password').type(password);
});

When('eu clico no botão de login', () => {
  cy.get('#login-button').click();
});

Then('eu devo ser redirecionado para a página inicial', () => {
  cy.url().should('include', '/home');
});
