import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('o usuário está logado', () => {
  cy.login('usuario123', 'senha123');
});

When('eu estou na página da loja da livraria', () => {
  cy.url().should('include', '/shop');
});

Then('a lista de produtos deve ser exibida', () => {
  cy.contains("Harry Potter and the Sorcerer's Stone").should('be.visible');
  cy.contains('A Game of Thrones').should('be.visible');
});

When('eu pesquiso por {string} no campo de pesquisa', (titulo: string) => {
  cy.get('[data-cy="input-search"]').type(titulo);
});

Then('a página deve filtrar os itens que contém esse título', () => {
  cy.contains('Harry Potter').should('be.visible');
});
