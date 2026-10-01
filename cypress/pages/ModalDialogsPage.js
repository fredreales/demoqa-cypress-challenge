import BasePage from './BasePage';

const selectors = {
  smallModalButton: '#showSmallModal',
  largeModalButton: '#showLargeModal',
  modal: '.modal-content',
  title: '.modal-title',
  body: '.modal-body',
  closeSmall: '#closeSmallModal',
  closeLarge: '#closeLargeModal',
};

export default class ModalDialogsPage extends BasePage {
  constructor() {
    super('/modal-dialogs');
    this.selectors = selectors;
  }

  get smallModalButton() {
    return cy.get(selectors.smallModalButton);
  }

  get largeModalButton() {
    return cy.get(selectors.largeModalButton);
  }

  get modal() {
    return cy.get(selectors.modal);
  }

  get title() {
    return cy.get(selectors.title);
  }

  get body() {
    return cy.get(selectors.body);
  }

  get closeSmallButton() {
    return cy.get(selectors.closeSmall);
  }

  get closeLargeButton() {
    return cy.get(selectors.closeLarge);
  }

  openSmall() {
    this.smallModalButton.click();
    return this;
  }

  openLarge() {
    this.largeModalButton.click();
    return this;
  }

  close(size) {
    const button = size === 'small' ? this.closeSmallButton : this.closeLargeButton;
    button.click();
    this.modal.should('not.exist');
    return this;
  }
}
