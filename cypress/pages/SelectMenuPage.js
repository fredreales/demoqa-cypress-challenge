import BasePage from './BasePage';

const selectors = {
  withOptGroup: '#withOptGroup',
  selectOne: '#selectOne',
  oldStyleSelect: '#oldSelectMenu',
  multiSelectNative: '#cars',
  selectedValue: (container) => `${container} [class*="singleValue"]`,
};

export default class SelectMenuPage extends BasePage {
  constructor() {
    super('/select-menu');
    this.selectors = selectors;
  }

  chooseGroupedOption(value) {
    cy.chooseFromReactSelect(selectors.withOptGroup, value);
    return this;
  }

  chooseTitle(value) {
    cy.chooseFromReactSelect(selectors.selectOne, value);
    return this;
  }

  selectedIn(container) {
    return cy.get(selectors.selectedValue(container));
  }

  chooseOldStyleColour(colour) {
    cy.get(selectors.oldStyleSelect).select(colour);
    return this;
  }

  chooseCars(cars) {
    cy.get(selectors.multiSelectNative).select(cars);
    return this;
  }
}
