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

  get titleSelect() {
    return cy.get(selectors.selectOne);
  }

  get colourSelect() {
    return cy.get(selectors.oldStyleSelect);
  }

  get carsSelect() {
    return cy.get(selectors.multiSelectNative);
  }

  get groupedValue() {
    return cy.get(selectors.selectedValue(selectors.withOptGroup));
  }

  get titleValue() {
    return cy.get(selectors.selectedValue(selectors.selectOne));
  }

  chooseGroupedOption(value) {
    cy.chooseFromReactSelect(selectors.withOptGroup, value);
    return this;
  }

  chooseTitle(value) {
    cy.chooseFromReactSelect(selectors.selectOne, value);
    return this;
  }

  chooseOldStyleColour(colour) {
    this.colourSelect.select(colour);
    return this;
  }

  chooseCars(cars) {
    this.carsSelect.select(cars);
    return this;
  }
}
