import BasePage from './BasePage';

const selectors = {
  userName: '#userName-value',
  goToBookStore: '#gotoStore',
  logout: 'Logout',
  table: '.profile-wrapper table',
  rows: '.profile-wrapper tbody tr',
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

  get userNameValue() {
    return cy.get(selectors.userName);
  }

  get table() {
    return cy.get(selectors.table);
  }

  get rows() {
    return cy.get(selectors.rows);
  }

  get modal() {
    return cy.get(selectors.modal);
  }

  get confirmDeleteButton() {
    return cy.get(selectors.confirmDelete);
  }

  get logoutButton() {
    return cy.contains('button', selectors.logout);
  }

  row(title) {
    return cy.contains(selectors.rows, title);
  }

  shouldShowUser(userName) {
    this.userNameValue.should('contain', userName);
    return this;
  }

  shouldHaveBookCount(count) {
    this.table.find('tbody tr').should('have.length', count);
    return this;
  }

  shouldContainBook(title) {
    this.rows.should('contain', title);
    return this;
  }

  deleteBook(title) {
    this.row(title).find(selectors.deleteInRow).click();
    this.modal.should('contain', 'Do you want to delete this book?');
    this.confirmDeleteButton.click();
    return this;
  }

  logout() {
    this.logoutButton.click();
    return this;
  }
}
