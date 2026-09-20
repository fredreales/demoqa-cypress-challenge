import './commands';
import 'cypress-mochawesome-reporter/register';
import { register as registerCypressGrep } from '@cypress/grep';

registerCypressGrep();

const THIRD_PARTY_ERRORS = [
  /Script error/i,
  /googletag/i,
  /adsbygoogle/i,
  /ResizeObserver loop/i,
  /Cannot read propert(y|ies) of null \(reading 'postMessage'\)/i,
];

Cypress.on('uncaught:exception', (err) => {
  const isThirdParty = THIRD_PARTY_ERRORS.some((pattern) => pattern.test(err.message));
  return !isThirdParty;
});
