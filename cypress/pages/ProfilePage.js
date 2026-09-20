import BasePage from './BasePage';

const selectors = {
  userName: '#userName-value',
  goToBookStore: '#gotoStore',
  logout: 'Logout',
  deleteAllBooks: 'Delete All Books',
  searchBox: '#searchBox',
  wrapper: '.profile-wrapper',
  table: '.profile-wrapper table',
  rows: '.profile-wrapper tbody tr',
  rowByText: (text) => `.profile-wrapper tbody tr:contains(${text})`,
  deleteInRow: '[id^="delete-record-"]',
  modal: '.modal-content',
  confirmDelete: '#closeSmallModal-ok',
  cancelDelete: '#closeSmallModal-cancel',
};

export default class ProfilePage extends BasePage {
  constructor() {
    super('/profile');
    this.selectors = selectors;
  }

  shouldShowUser(userName) {
    cy.get(selectors.userName).should('contain', userName);
    return this;
  }

  rows() {
    cy.get(selectors.table).should('exist');
    return cy.get(selectors.table).find('tbody tr');
  }

  shouldHaveBookCount(count) {
    cy.get(selectors.table).should('exist');
    cy.get(selectors.table).find('tbody tr').should('have.length', count);
    return this;
  }

  shouldContainBook(title) {
    cy.get(selectors.rows).should('contain', title);
    return this;
  }

  deleteBook(title) {
    cy.get(selectors.rowByText(title)).find(selectors.deleteInRow).click();
    cy.get(selectors.modal).should('contain', 'Do you want to delete this book?');
    cy.get(selectors.confirmDelete).click();
    return this;
  }

  logout() {
    cy.contains('button', selectors.logout).click();
    return this;
  }
}
