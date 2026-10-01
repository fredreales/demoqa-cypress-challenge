import SelectMenuPage from '../../pages/SelectMenuPage';

const selectMenu = new SelectMenuPage();

describe('Select Menu', () => {
  beforeEach(() => {
    selectMenu.visit();
  });

  it('selects an option from a grouped custom dropdown', { tags: ['@smoke'] }, () => {
    selectMenu.chooseGroupedOption('Group 2, option 1');

    selectMenu.groupedValue.should('have.text', 'Group 2, option 1');
  });

  it('replaces the previous choice in a single-select dropdown', () => {
    selectMenu.chooseTitle('Dr.');
    selectMenu.titleValue.should('have.text', 'Dr.');

    selectMenu.chooseTitle('Prof.');

    selectMenu.titleValue.should('have.text', 'Prof.');
    selectMenu.titleSelect.should('not.contain', 'Dr.');
  });

  it('selects a value in a native select element', () => {
    selectMenu.chooseOldStyleColour('Green');

    selectMenu.colourSelect.should('have.value', '2');
  });

  it('selects several values in a native multi-select', () => {
    selectMenu.chooseCars(['Volvo', 'Audi']);

    selectMenu.carsSelect.invoke('val').should('deep.equal', ['volvo', 'audi']);
  });
});
