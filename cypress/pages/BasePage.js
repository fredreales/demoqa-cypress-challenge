export default class BasePage {
  constructor(path) {
    this.path = path;
  }

  visit() {
    cy.visitPage(this.path);
    return this;
  }
}
