import BasePage from './BasePage';

const selectors = {
  searchBox: '#searchBox',
  wrapper: '.books-wrapper',
  rows: '.books-wrapper tbody tr',
  titleCell: '.books-wrapper tbody tr td:nth-child(2)',
  bookLink: (title) => `[id="see-book-${title}"] a`,
  loginButton: '#login',
  addToCollection: 'Add To Your Collection',
  backToStore: 'Back To Book Store',
  detailValue: (field) => `#${field}-wrapper .col-md-9 label`,
};

export const BOOKS_ENDPOINT = '/BookStore/v1/Books';

export default class BookStorePage extends BasePage {
  constructor() {
    super('/books');
    this.selectors = selectors;
  }

  visitBook(isbn) {
    cy.visitPage(`/books?search=${isbn}`);
    return this;
  }

  search(term) {
    cy.get(selectors.searchBox).clear();
    if (term) cy.get(selectors.searchBox).type(term);
    return this;
  }

  rows() {
    return cy.get(selectors.wrapper).find('tbody tr');
  }

  titles() {
    return cy
      .get(selectors.wrapper)
      .then(($wrapper) =>
        [...$wrapper.find('tbody tr td:nth-child(2)')].map((cell) => cell.innerText.trim()),
      );
  }

  openBook(title) {
    cy.get(selectors.bookLink(title)).click();
    return this;
  }

  addToCollection() {
    cy.contains('button', selectors.addToCollection).click();
    return this;
  }

  detail(field) {
    return cy.get(selectors.detailValue(field));
  }

  shouldHaveRowCount(count) {
    cy.get(selectors.wrapper).find('tbody tr').should('have.length', count);
    return this;
  }
}
