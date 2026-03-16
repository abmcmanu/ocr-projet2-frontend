// Déclaration TypeScript de la commande personnalisée cy.login()
declare namespace Cypress {
  interface Chainable {
    login(): Chainable<void>;
  }
}