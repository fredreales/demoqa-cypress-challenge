import BookStorePage, { BOOKS_ENDPOINT } from '../../pages/BookStorePage';
import ProfilePage from '../../pages/ProfilePage';
import { buildAccount } from '../../utils/dataFactory';

const bookStore = new BookStorePage();
const profile = new ProfilePage();

describe('Book Store — signed-in account', { tags: ['@creates-account'] }, () => {
  const account = buildAccount();
  let firstBook;
  let userId;

  before(() => {
    cy.createUserByApi(account).then(({ status, body }) => {
      expect(status).to.equal(201);
      userId = body.userID;
    });
    cy.request(BOOKS_ENDPOINT).then(({ body }) => {
      firstBook = body.books[0];
    });
  });

  after(() => {
    if (!userId) return;
    cy.bookStoreToken(account).then(({ body }) => {
      if (!body.token) return;
      cy.asBookStoreUser(body.token, { method: 'DELETE', url: `/Account/v1/User/${userId}` });
    });
  });

  beforeEach(() => {
    cy.signInByUi(account);
    profile.visit();
  });

  it('shows the signed-in user on the profile page', () => {
    profile.shouldShowUser(account.userName);
    cy.contains('button', 'Logout').should('be.visible');
  });

  it('starts with an empty collection', () => {
    profile.shouldHaveBookCount(0);
  });

  it('adds a book to the collection from its detail page', () => {
    cy.on('window:alert', cy.stub().as('alert'));

    bookStore.visitBook(firstBook.isbn);
    bookStore.addToCollection();

    profile.visit();
    profile.shouldContainBook(firstBook.title);
  });

  it('shows the collected book with the data the API holds', () => {
    profile.rows().should('have.length', 1);
    cy.get(profile.selectors.rows).should('contain', firstBook.author);
  });

  it('removes a book from the collection', () => {
    profile.deleteBook(firstBook.title);

    profile.shouldHaveBookCount(0);
  });

  it('logout', () => {
    profile.logout();

    cy.location('pathname').should('equal', '/login');
  });
});
