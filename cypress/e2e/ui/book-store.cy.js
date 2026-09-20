import BookStorePage, { BOOKS_ENDPOINT } from '../../pages/BookStorePage';
import LoginPage from '../../pages/LoginPage';

const bookStore = new BookStorePage();
const login = new LoginPage();

describe('Book Store — catalogue', () => {
  beforeEach(() => {
    bookStore.visit();
  });

  it('lists every book the API returns', { tags: ['@smoke'] }, () => {
    cy.request(BOOKS_ENDPOINT).then(({ status, body }) => {
      expect(status).to.equal(200);
      bookStore.shouldHaveRowCount(body.books.length);

      body.books.forEach((book) => {
        cy.contains(bookStore.selectors.rows, book.title).should('contain', book.author);
      });
    });
  });

  it('filters the list by a partial, case-insensitive title', () => {
    bookStore.search('JAVASCRIPT');

    bookStore.titles().should((titles) => {
      expect(titles).to.have.length.greaterThan(0);
      titles.forEach((title) => expect(title.toLowerCase()).to.include('javascript'));
    });
  });

  it('filters the list by author', () => {
    bookStore.search('Kyle Simpson');

    bookStore.shouldHaveRowCount(1);
    cy.get(bookStore.selectors.rows).should('contain', "You Don't Know JS");
  });

  it('shows no rows for a term that matches nothing', () => {
    bookStore.search('no-such-book');

    bookStore.shouldHaveRowCount(0);
  });

  it('restores the full list when the search is cleared', () => {
    cy.request(BOOKS_ENDPOINT).then(({ body }) => {
      bookStore.search('Kyle Simpson');
      bookStore.shouldHaveRowCount(1);

      bookStore.search('');

      bookStore.shouldHaveRowCount(body.books.length);
    });
  });

  it('opens a book from the list and shows the details the API holds', () => {
    cy.request(BOOKS_ENDPOINT).then(({ body }) => {
      const book = body.books[0];

      bookStore.openBook(book.title);

      cy.location('search').should('equal', `?search=${book.isbn}`);
      bookStore.detail('ISBN').should('have.text', book.isbn);
      bookStore.detail('title').should('have.text', book.title);
      bookStore.detail('author').should('have.text', book.author);
      bookStore.detail('publisher').should('have.text', book.publisher);
      bookStore.detail('pages').should('have.text', String(book.pages));
    });
  });

  it('deep-links straight to a book detail page', () => {
    cy.request(BOOKS_ENDPOINT).then(({ body }) => {
      const book = body.books[body.books.length - 1];

      bookStore.visitBook(book.isbn);

      bookStore.detail('ISBN').should('have.text', book.isbn);
      bookStore.detail('title').should('have.text', book.title);
    });
  });
});

describe('Book Store — access control', () => {
  it('rejects credentials that do not belong to an account', { tags: ['@smoke'] }, () => {
    login.visit();

    login.fillCredentials('not_a_real_user_98765', 'NotARealPassword@1').submit();

    login.error().should('have.text', 'Invalid username or password!');
    cy.location('pathname').should('equal', '/login');
  });

  it('marks both fields invalid when submitted empty', () => {
    login.visit();

    login.submit();

    cy.get(login.selectors.userName).should('have.class', 'is-invalid');
    cy.get(login.selectors.password).should('have.class', 'is-invalid');
    login.error().should('not.exist');
  });

  it('offers registration from the login page', () => {
    login.visit();

    login.goToRegistration();

    cy.location('pathname').should('equal', '/register');
    cy.get('#firstname').should('be.visible');
    cy.get('#register').should('be.visible');
  });

  it('tells an anonymous visitor they are not logged in', () => {
    cy.visitPage('/profile');

    cy.get('#notLoggin-label').should(
      'contain',
      'Currently you are not logged into the Book Store application',
    );
  });
});
