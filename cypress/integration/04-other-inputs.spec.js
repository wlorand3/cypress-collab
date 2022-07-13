/// <reference types="cypress" />

describe('Secret Menu Items', () => {
  beforeEach(() => {
    // Secret Menu App
    cy.visit('/secret-menu');
    // set some alias vars for use in multiple tests
    cy.get('#minimum-rating-visibility').as('rating-filter');
    cy.get('#restaurant-visibility-filter').as('restaurant-filter');
  });

  it('should set the range and verify it', () => {
    // change it -- slide?  .invoke('val', 7) // jquery
    cy.get('@rating-filter').invoke('val', '7').trigger('input');
    cy.get('@rating-filter').should('have.value', '7');
  });

  it('should check the checkbox and verify it', () => {
    // show .checked  .should('be.checked') ?
    // cy.get('input[type="checkbox"]').as('checkbox').check();
    // cy.get('@checkbox').should('be.checked');
    // refactor to chain w/o need for alias
    cy.get('input[type="checkbox"]').check().should('be.checked');
  });

  it('should select an option from the select and verify it', () => {
    // .select(), .should('have.value') ?
    cy.get('@restaurant-filter').select('Taco Bell');
    cy.get('@restaurant-filter').should('have.value', 'Taco Bell');
  });
});
