import { faker } from '@faker-js/faker';

const MAX_NAME_LENGTH = 25;

const SUBJECTS = ['Maths', 'Physics', 'Chemistry', 'Biology', 'History', 'Economics', 'Accounting'];
const HOBBIES = ['Sports', 'Reading', 'Music'];

const STATES = {
  NCR: ['Delhi', 'Gurgaon', 'Noida'],
  'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
  Haryana: ['Karnal', 'Panipat'],
  Rajasthan: ['Jaipur', 'Jaiselmer'],
};

const person = () => {
  const firstName = faker.person.firstName().slice(0, MAX_NAME_LENGTH);
  const lastName = faker.person.lastName().slice(0, MAX_NAME_LENGTH);
  return {
    firstName,
    lastName,
    email: faker.internet
      .email({ firstName, lastName, provider: `${faker.string.numeric(6)}.example.com` })
      .toLowerCase(),
  };
};

export const buildEmployee = (overrides = {}) => ({
  ...person(),
  age: String(faker.number.int({ min: 18, max: 99 })),
  salary: String(faker.number.int({ min: 1000, max: 999999 })),
  department: faker.commerce.department().slice(0, MAX_NAME_LENGTH),
  ...overrides,
});

export const buildStudent = (overrides = {}) => {
  const state = faker.helpers.objectKey(STATES);

  return {
    ...person(),
    gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
    mobile: faker.string.numeric(10),
    dateOfBirth: buildDateOfBirth(),
    subjects: faker.helpers.arrayElements(SUBJECTS, 2),
    hobbies: faker.helpers
      .arrayElements(HOBBIES, { min: 1, max: 3 })
      .sort((a, b) => HOBBIES.indexOf(a) - HOBBIES.indexOf(b)),
    picture: 'profile.png',
    currentAddress: faker.location.streetAddress(),
    state,
    city: faker.helpers.arrayElement(STATES[state]),
    ...overrides,
  };
};

export const buildDateOfBirth = () => {
  const date = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: date.toLocaleString('en-US', { month: 'long' }),
    year: String(date.getFullYear()),
  };
};

export const formatDateOfBirth = ({ day, month, year }) => `${day} ${month},${year}`;

export const buildAccount = (overrides = {}) => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  userName:
    `${faker.internet.username().replace(/[^a-zA-Z0-9_]/g, '')}_${faker.string.alphanumeric(6)}`.toLowerCase(),
  password: [
    faker.string.alpha({ length: 4, casing: 'lower' }),
    faker.string.alpha({ length: 2, casing: 'upper' }),
    faker.string.numeric(2),
    faker.helpers.arrayElement(['!', '@', '#', '$', '%']),
  ].join(''),
  ...overrides,
});
