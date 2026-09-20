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

  openSmall() {
    cy.get(selectors.smallModalButton).click();
    return this;
  }

  openLarge() {
    cy.get(selectors.largeModalButton).click();
    return this;
  }

  modal() {
    return cy.get(selectors.modal).should('be.visible');
  }

  close(size) {
    cy.get(size === 'small' ? selectors.closeSmall : selectors.closeLarge).click();
    cy.get(selectors.modal).should('not.exist');
    return this;
  }
}
