// get typescript types for cypress to aid dev autocompletion
/// <reference types="cypress" />

describe('Aliases', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
    cy.get('[data-test="items"]').as('allItems');
    cy.get('[data-test="items-unpacked"]').as('unpackedItems');
    cy.get('[data-test="items-packed"]').as('packedItems');

    cy.get('[data-test="filter-items"]').as('filterInput');
  });

  describe('Test Filter with Alias', () => {
    it('should filter items on the page...', () => {
      cy.get('@filterInput').type('iPhone');
      cy.get('@allItems').should('contain.text', 'iPhone'); // proof of filter +
      cy.get('@allItems').should('not.contain.text', 'Hoodie'); // proof of filter -
    });
  });

  // test-B for syntax
  describe.skip('It should say hi', () => {
    it('should greet the user', () => {
      cy.get('[data-test="new-item-input"]').type('what up!');
    });
  });
});
