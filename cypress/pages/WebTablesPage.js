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

  get addRecordButton() {
    return cy.get(selectors.addRecord);
  }

  get searchInput() {
    return cy.get(selectors.searchBox);
  }

  get table() {
    return cy.get(selectors.table);
  }

  get rows() {
    return cy.get(selectors.rows);
  }

  get pageIndicator() {
    return cy.get(selectors.pagination.indicator);
  }

  get rowsPerPageSelect() {
    return cy.get(selectors.pagination.rowsPerPage);
  }

  get formModal() {
    return cy.get(selectors.form.modal);
  }

  get firstNameInput() {
    return cy.get(selectors.form.firstName);
  }

  get lastNameInput() {
    return cy.get(selectors.form.lastName);
  }

  get emailInput() {
    return cy.get(selectors.form.email);
  }

  get ageInput() {
    return cy.get(selectors.form.age);
  }

  get salaryInput() {
    return cy.get(selectors.form.salary);
  }

  get departmentInput() {
    return cy.get(selectors.form.department);
  }

  get submitButton() {
    return cy.get(selectors.form.submit);
  }

  get closeFormButton() {
    return cy.get(selectors.form.close);
  }

  row(text) {
    return cy.get(selectors.rowByText(text));
  }

  paginationButton(label) {
    return cy.get(selectors.pagination.button(label));
  }

  openAddRecordForm() {
    this.addRecordButton.click();
    this.formModal.should('be.visible');
    return this;
  }

  fillRecordForm(record) {
    this.fillField(() => this.firstNameInput, record.firstName);
    this.fillField(() => this.lastNameInput, record.lastName);
    this.fillField(() => this.emailInput, record.email);
    this.fillField(() => this.ageInput, record.age);
    this.fillField(() => this.salaryInput, record.salary);
    this.fillField(() => this.departmentInput, record.department);
    return this;
  }

  closeRecordForm() {
    this.closeFormButton.click();
    this.formModal.should('not.exist');
    return this;
  }

  submitRecordForm() {
    this.submitButton.click();
    return this;
  }

  addRecord(record) {
    this.openAddRecordForm();
    this.fillRecordForm(record);
    this.submitRecordForm();
    this.formModal.should('not.exist');
    return this;
  }

  editRecordBy(matchText, changes) {
    this.row(matchText).find(selectors.editInRow).click();
    this.formModal.should('be.visible');
    this.fillRecordForm(changes);
    this.submitRecordForm();
    this.formModal.should('not.exist');
    return this;
  }

  deleteRecordBy(matchText) {
    this.row(matchText).find(selectors.deleteInRow).click();
    return this;
  }

  search(term) {
    return this.fillField(() => this.searchInput, term || '');
  }

  rowData() {
    return this.table.then(($table) =>
      [...$table.find('tbody tr')].map((row) =>
        [...row.querySelectorAll('td')].slice(0, 6).map((cell) => cell.innerText.trim()),
      ),
    );
  }

  shouldHaveRowCount(count) {
    this.table.find('tbody tr').should('have.length', count);
    return this;
  }

  shouldContainRecord(record) {
    this.row(record.email).within(() => {
      cy.contains('td', record.firstName).should('exist');
      cy.contains('td', record.lastName).should('exist');
      cy.contains('td', record.department).should('exist');
    });
    return this;
  }

  shouldNotContainRecord(record) {
    this.table.should('not.contain', record.email);
    return this;
  }

  setRowsPerPage(count) {
    this.rowsPerPageSelect.select(String(count));
    return this;
  }

  goTo(label) {
    this.paginationButton(label).click();
    return this;
  }
}
