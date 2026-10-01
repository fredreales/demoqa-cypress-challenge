export const SECRET_TYPING = { log: false, parseSpecialCharSequences: false };

export default class BasePage {
  constructor(path) {
    this.path = path;
  }

  visit() {
    cy.visitPage(this.path);
    return this;
  }

  fillField(getField, value, options = {}) {
    if (value === undefined) return this;
    getField().clear();
    if (value !== '') getField().type(value, options);
    return this;
  }
}
