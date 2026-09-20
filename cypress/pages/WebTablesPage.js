import BasePage from './BasePage';

const selectors = {
  addRecord: '#addNewRecordButton',
  searchBox: '#searchBox',
  table: '.web-tables-wrapper table',
  rows: '.web-tables-wrapper tbody tr',
  rowByText: (text) => `.web-tables-wrapper tbody tr:contains(${text})`,
  deleteInRow: '[id^="delete-record-"]',
  editInRow: '[id^="edit-record-"]',
  pagination: {
    root: '.pagination',
    button: (label) => `.pagination button:contains(${label})`,
    indicator: '.pagination strong',
    rowsPerPage: '.pagination select',
  },
  form: {
    modal: '.modal-content',
    firstName: '#firstName',
    lastName: '#lastName',
    email: '#userEmail',
    age: '#age',
    salary: '#salary',
    department: '#department',
    submit: '#submit',
    close: '.modal-header [aria-label="Close"]',
    title: '#registration-form-modal',
  },
};

export const SEED_RECORD_COUNT = 3;

export default class WebTablesPage extends BasePage {
  constructor() {
    super('/webtables');
    this.selectors = selectors;
  }

  openAddRecordForm() {
    cy.get(selectors.addRecord).click();
    cy.get(selectors.form.modal).should('be.visible');
    return this;
  }

  fillRecordForm(record) {
    const { form } = selectors;
    const fields = [
      [form.firstName, record.firstName],
      [form.lastName, record.lastName],
      [form.email, record.email],
      [form.age, record.age],
      [form.salary, record.salary],
      [form.department, record.department],
    ];
    fields.forEach(([selector, value]) => {
      if (value === undefined) return;
      cy.get(selector).clear();
      if (value !== '') cy.get(selector).type(value);
    });
    return this;
  }

  closeRecordForm() {
    cy.get(selectors.form.close).click();
    cy.get(selectors.form.modal).should('not.exist');
    return this;
  }

  submitRecordForm() {
    cy.get(selectors.form.submit).click();
    return this;
  }

  addRecord(record) {
    this.openAddRecordForm();
    this.fillRecordForm(record);
    this.submitRecordForm();
    cy.get(selectors.form.modal).should('not.exist');
    return this;
  }

  editRecordBy(matchText, changes) {
    cy.get(selectors.rowByText(matchText)).find(selectors.editInRow).click();
    cy.get(selectors.form.modal).should('be.visible');
    this.fillRecordForm(changes);
    this.submitRecordForm();
    cy.get(selectors.form.modal).should('not.exist');
    return this;
  }

  deleteRecordBy(matchText) {
    cy.get(selectors.rowByText(matchText)).find(selectors.deleteInRow).click();
    return this;
  }

  search(term) {
    cy.get(selectors.searchBox).clear();
    if (term) cy.get(selectors.searchBox).type(term);
    return this;
  }

  rows() {
    return cy.get(selectors.table).find('tbody tr');
  }

  rowData() {
    return cy
      .get(selectors.table)
      .then(($table) =>
        [...$table.find('tbody tr')].map((row) =>
          [...row.querySelectorAll('td')].slice(0, 6).map((cell) => cell.innerText.trim()),
        ),
      );
  }

  shouldHaveRowCount(count) {
    if (count === 0) {
      cy.get(selectors.table).find('tbody tr').should('have.length', 0);
    } else {
      this.rows().should('have.length', count);
    }
    return this;
  }

  shouldContainRecord(record) {
    cy.get(selectors.rowByText(record.email)).within(() => {
      cy.contains('td', record.firstName).should('exist');
      cy.contains('td', record.lastName).should('exist');
      cy.contains('td', record.department).should('exist');
    });
    return this;
  }

  shouldNotContainRecord(record) {
    cy.get(selectors.table).should('not.contain', record.email);
    return this;
  }

  setRowsPerPage(count) {
    cy.get(selectors.pagination.rowsPerPage).select(String(count));
    return this;
  }

  goTo(label) {
    cy.get(selectors.pagination.button(label)).click();
    return this;
  }

  pageIndicator() {
    return cy.get(selectors.pagination.indicator);
  }
}
