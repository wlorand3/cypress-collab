/// <reference types="cypress" />

const restaurants = [
  'Chick-fil-A',
  'McDonalds',
  'In-N-Out',
  'KFC',
  'Jack In The Box',
  'Jamba Juice',
  'Starbucks',
  'Dairy Queen',
  'Burger King',
  'Chipotle',
  'Taco Bell',
  'Five Guys',
  'Sonic',
  'Subway',
  'Panera Bread',
];

const properties = [
  'name',
  'whereToOrder',
  'description',
  'secret',
  'ingredients',
  'popularity',
  'price',
  'howToOrder',
];

const ratings = [1, 2, 3, 4, 5, 6, 7];

describe('Secret Menu Items', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');
  });

  it('should exist have the title on the page', () => {
    cy.get('h1').should('contain', 'Secret Menu Items');
  });

  // loop over the propert checkboxes array and generate tests
  for (const property of properties) {
    it(`should have a column for ${property}`, () => {
      cy.get(`#${property}-column`);
    });

    it(`should have a column for showing the ${property} column`, () => {
      // each column has an id of #show-
      cy.get(`#show-${property}`);
    });

    it('should hide the column when the checkbox is unchecked', () => {
      cy.get(`#show-${property}`).click();
      // grab each col for the property
      cy.get(`#${property}-column`).should('be.hidden');
    });
  }
});

describe('Ratings Filter', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');
    cy.get('#minimum-rating-visibility').as('ratingFilter');
  });

  // this should 'generate' 7 tests, 1 for each rating
  for (const rating of ratings) {
    // loop over the ratings array at top of page
    it(`should only display items with a popularity above ${rating}`, () => {
      // move the ratings filter to the next level
      cy.get('@ratingFilter').invoke('val', rating).trigger('change');
      // check the popularity field value
      cy.get('td[headers="popularity-column"]').each(($el) => {
        console.log(`$el is ${JSON.stringify($el)}`);
        expect(+$el.text()).to.be.gte(rating);
      });
    });
  }
});

describe('Restaurant Filter', () => {
  beforeEach(() => {
    cy.visit('/secret-menu');
    cy.get('#restaurant-visibility-filter').as('restaurant-filter');
  });

  for (const restaurant of restaurants) {
    it(`should only display rows that match ${restaurant} when selected`, () => {
      cy.get('@restaurant-filter').select(restaurant);

      cy.get('td[headers="whereToOrder-column"]').should('contain', restaurant);
    });
  }
});
