import SelectMenuPage from '../../pages/SelectMenuPage';

const selectMenu = new SelectMenuPage();

describe('Select Menu', () => {
  beforeEach(() => {
    selectMenu.visit();
  });

  it('selects an option from a grouped custom dropdown', { tags: ['@smoke'] }, () => {
    selectMenu.chooseGroupedOption('Group 2, option 1');

    selectMenu
      .selectedIn(selectMenu.selectors.withOptGroup)
      .should('have.text', 'Group 2, option 1');
  });

  it('replaces the previous choice in a single-select dropdown', () => {
    selectMenu.chooseTitle('Dr.');
    selectMenu.selectedIn(selectMenu.selectors.selectOne).should('have.text', 'Dr.');

    selectMenu.chooseTitle('Prof.');

    selectMenu.selectedIn(selectMenu.selectors.selectOne).should('have.text', 'Prof.');
    cy.get(selectMenu.selectors.selectOne).should('not.contain', 'Dr.');
  });

  it('selects a value in a native select element', () => {
    selectMenu.chooseOldStyleColour('Green');

    cy.get(selectMenu.selectors.oldStyleSelect).should('have.value', '2');
  });

  it('selects several values in a native multi-select', () => {
    selectMenu.chooseCars(['Volvo', 'Audi']);

    cy.get(selectMenu.selectors.multiSelectNative)
      .invoke('val')
      .should('deep.equal', ['volvo', 'audi']);
  });
});
