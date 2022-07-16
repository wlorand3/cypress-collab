/// <reference types="cypress" />

describe('Basic Practice', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
  });

  describe('Adding a new item', () => {
    it('should put a new item on the page after clicking on "Add Item"', () => {
      const item = 'Binocs';
      cy.get('[data-test="new-item-input"]').type(item);
      cy.get('[data-test="add-item"]').click();
      cy.contains(item);
    });

    it('should put a new item in the "Unpacked Items" list', () => {
      const item = 'Binocs';
      cy.get('[data-test="new-item-input"]').type(item);
      // alt - submit the first form : cy.get('form').submit()
      cy.get('[data-test="add-item"]').click();
      // get the unpacked items list
      cy.get('[data-test="items-unpacked"]').contains(item);
    });

    // this is really the only test needed here (previous 2 build to this one)
    it('should put a new item as the last item in the "Unpacked Items" list', () => {
      const item = 'Binocs';
      cy.get('[data-test="new-item-input"]').type(item);
      cy.get('[data-test="add-item"]').click();
      cy.get('[data-test="items-unpacked"] li').last().contains(item);
    });
  });

  describe('Filtering items', () => {
    it('should show items that match whatever is in the filter field', () => {
      cy.get('[data-test="filter-items"]').type('Tooth'); // type in the input

      cy.contains('Tooth Brush'); // * use contains for anywhere in the document (Document Object?)
      cy.contains('Tooth Paste');
    });

    // the reverse: use of ther ! not operator (NOPE) - should('not.exist')
    it('should hide items that do not match whatever is in the filter field', () => {
      cy.get('[data-test="filter-items"]').type('Tooth');
      cy.contains('Hoodie').should('not.exist'); // use of .should('not exist') as a !
    });
  });

  describe('Removing items', () => {
    describe('Remove all', () => {
      it('should remove all of the items', () => {
        cy.get('[data-test="remove-all"]').click();
        cy.get('[data-test="items"] li').should('not.exist');
      });
    });

    describe('Remove individual items', () => {
      it('there should be a remove button on an item', () => {
        cy.get('[data-test="items"] li').find('[data-test="remove"]'); // use of $.find()
      });

      it('should remove an item from the page', () => {
        // most basic
        cy.contains('Tooth Brush').parent().find('[data-test="remove"]').click();
        cy.contains('Tooth Brush').should('not.exist');
        // alt -- use of $.each() to check them all
        //  cy.get('[data-test="items"] li').each((li) => {
        //    cy.wrap(li).find('[data-test="remove"]').should('exist');
        //  });
        // alt2 -- use of $.within() and simulates a .click
        //  cy.get('[data-test="items"] li')
        //    .first()
        //    .within(() => cy.get('[data-test="remove"]').click())
        //    .should('not.exist');
      });
    });
  });

  describe('Mark all as unpacked', () => {
    it('should empty out the "Packed" list', () => {
      // basic
      // cy.get('[data-test="mark-all-as-unpacked"]').click();
      // cy.get('[data-test="items-packed"] li').should('not.exist');
      // brittle - uses hard-coded length
      // cy.get('[data-test="mark-all-as-unpacked"]').click();
      // cy.get('[data-test="items-unpacked"] li').its('length').should('eq', 5);
      // better - takes in a dynamic count
      cy.get('[data-test="items"] li')
        .its('length')
        .then((count) => {
          cy.get('[data-test="mark-all-as-unpacked"]').click();
          cy.get('[data-test="items-unpacked"] li').its('length').should('eq', count);
        });
    });

    it('should empty have all of the items in the "Unpacked" list', () => {});
  });

  describe('Mark individual item as packed', () => {
    it('should move an individual item from "Unpacked" to "Packed"', () => {
      // basic - brittle (but passable) - hard-coded item
      // cy.get('[data-test="items-unpacked"]').contains('Tooth Brush').click();
      // cy.get('[data-test="items-packed"]').contains('Tooth Brush').should('exist');
      // better - within() to scope actions, + .then() takes a $var
      cy.get('[data-test="items-unpacked"] li label')
        .first()
        .within(() => {
          cy.get('input[type="checkbox"]').click();
        })
        .then(($item) => {
          const text = $item.text();
          cy.get('[data-test="items-packed"] li label').first().should('have.text', text);
        });
    });
  });
});
