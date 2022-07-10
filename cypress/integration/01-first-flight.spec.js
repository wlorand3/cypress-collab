/// <reference types="cypress" />

describe('Create a New Item', () => {
  // visit a page in a beforeEach
  beforeEach(() => {
    cy.visit('/jetsetter');
  });
  // write a test in an it() block
  it('should have a form', () => {
    cy.get('formm').should('not.exist');
  });

  //   it('should have the word "Tooth"'),
  //     () => {
  //       cy.contains('Tooth'); // syntax issue?
  //     };

  it('should type into an input field', () => {
    cy.get('[data-test="new-item-input"]').type('Good Attitude');
  });
});
