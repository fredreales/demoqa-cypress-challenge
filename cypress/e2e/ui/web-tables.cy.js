import WebTablesPage, { SEED_RECORD_COUNT } from '../../pages/WebTablesPage';
import { buildEmployee } from '../../utils/dataFactory';

const webTables = new WebTablesPage();

describe('Web Tables — record management', () => {
  beforeEach(() => {
    webTables.visit();
    webTables.shouldHaveRowCount(SEED_RECORD_COUNT);
  });

  it('adds a record and shows it in the table', { tags: ['@smoke'] }, () => {
    const employee = buildEmployee();

    webTables.addRecord(employee);

    webTables.shouldHaveRowCount(SEED_RECORD_COUNT + 1);
    webTables.shouldContainRecord(employee);
  });

  it('keeps the modal open and rejects an incomplete record', () => {
    const employee = buildEmployee({ department: '' });

    webTables.openAddRecordForm().fillRecordForm(employee).submitRecordForm();

    cy.get(webTables.selectors.form.modal).should('be.visible');
    cy.get(webTables.selectors.form.department).shouldBeInvalid();
    webTables.closeRecordForm();
    webTables.shouldHaveRowCount(SEED_RECORD_COUNT);
  });

  it('updates an existing record through the edit form', () => {
    const employee = buildEmployee();
    webTables.addRecord(employee);

    webTables.editRecordBy(employee.email, { department: 'Quality Assurance', salary: '99999' });

    webTables.shouldContainRecord({ ...employee, department: 'Quality Assurance' });
    cy.get(webTables.selectors.rowByText(employee.email)).should('contain', '99999');
  });

  it('removes a record when it is deleted', () => {
    const employee = buildEmployee();
    webTables.addRecord(employee);

    webTables.deleteRecordBy(employee.email);

    webTables.shouldNotContainRecord(employee);
  });

  describe('search', () => {
    it('filters rows by a value from any column', { tags: ['@smoke'] }, () => {
      webTables.search('Legal');

      webTables.shouldHaveRowCount(1);
      cy.get(webTables.selectors.rows).should('contain', 'Kierra');
    });

    it('matches on a partial, case-insensitive term', () => {
      webTables.search('ciER');

      webTables.shouldHaveRowCount(1);
      cy.get(webTables.selectors.rows).should('contain', 'cierra@example.com');
    });

    it('shows an empty table for a term that matches nothing', () => {
      webTables.search('no-such-employee');

      webTables.shouldHaveRowCount(0);
    });

    it('restores every row when the search term is cleared', () => {
      webTables.search('Legal');
      webTables.shouldHaveRowCount(1);

      webTables.search('');

      webTables.shouldHaveRowCount(SEED_RECORD_COUNT);
    });
  });

  describe('pagination', () => {
    it('paginates once the record count exceeds the page size', () => {
      cy.fixture('webTablesBulk').then(({ departments }) => {
        departments.forEach((department) => {
          webTables.addRecord(buildEmployee({ department }));
        });
      });

      webTables.pageIndicator().should('have.text', '1 of 2');
      webTables.shouldHaveRowCount(10);

      webTables.goTo('Next');
      webTables.pageIndicator().should('have.text', '2 of 2');
      webTables.shouldHaveRowCount(1);
      cy.get(webTables.selectors.pagination.button('Next')).should('be.disabled');

      webTables.goTo('First');
      webTables.pageIndicator().should('have.text', '1 of 2');

      webTables.setRowsPerPage(20);
      webTables.pageIndicator().should('have.text', '1 of 1');
      webTables.shouldHaveRowCount(11);
    });

    it('disables the navigation buttons when everything fits on one page', () => {
      cy.get(webTables.selectors.pagination.button('First')).should('be.disabled');
      cy.get(webTables.selectors.pagination.button('Previous')).should('be.disabled');
      cy.get(webTables.selectors.pagination.button('Next')).should('be.disabled');
      cy.get(webTables.selectors.pagination.button('Last')).should('be.disabled');
    });
  });
});
