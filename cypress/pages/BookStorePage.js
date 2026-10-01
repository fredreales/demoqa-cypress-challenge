import BasePage from './BasePage';

const selectors = {
  searchBox: '#searchBox',
  table: '.books-wrapper table',
  rows: '.books-wrapper tbody tr',
  bookLink: (title) => `[id="see-book-${title}"] a`,
  addToCollection: 'Add To Your Collection',
  detailValue: (field) => `#${field}-wrapper .col-md-9 label`,
};

export const BOOKS_ENDPOINT = '/BookStore/v1/Books';

export default class BookStorePage extends BasePage {
  constructor() {
    super('/books');
    this.selectors = selectors;
  }

  get searchInput() {
    return cy.get(selectors.searchBox);
  }

  get table() {
    return cy.get(selectors.table);
  }

  get rows() {
    return cy.get(selectors.rows);
  }

  get addToCollectionButton() {
    return cy.contains('button', selectors.addToCollection);
  }

  row(title) {
    return cy.contains(selectors.rows, title);
  }

  bookLink(title) {
    return cy.get(selectors.bookLink(title));
  }

  detail(field) {
    return cy.get(selectors.detailValue(field));
  }

  visitBook(isbn) {
    cy.visitPage(`/books?search=${isbn}`);
    return this;
  }

  search(term) {
    return this.fillField(() => this.searchInput, term || '');
  }

  titles() {
    return cy
      .get(selectors.table)
      .then(($table) =>
        [...$table.find('tbody tr td:nth-child(2)')].map((cell) => cell.innerText.trim()),
      );
  }

  openBook(title) {
    this.bookLink(title).click();
    return this;
  }

  addToCollection() {
    this.addToCollectionButton.click();
    return this;
  }

  shouldHaveRowCount(count) {
    this.table.find('tbody tr').should('have.length', count);
    return this;
  }
}
