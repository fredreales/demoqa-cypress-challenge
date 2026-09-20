const { defineConfig } = require('cypress');

const AD_AND_ANALYTICS_HOSTS = [
  '*.googlesyndication.com',
  '*.doubleclick.net',
  '*.googletagservices.com',
  '*.googletagmanager.com',
  '*.google-analytics.com',
  '*.adtrafficquality.google',
  '*.adplus.com',
  '*.adsrvr.org',
];

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'demoqa.com — Cypress suite',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    overwrite: true,
    saveJson: true,
  },
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://demoqa.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    viewportWidth: 1400,
    viewportHeight: 900,

    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 15000,
    responseTimeout: 15000,

    scrollBehavior: 'center',

    video: false,
    screenshotOnRunFailure: true,
    experimentalMemoryManagement: true,

    blockHosts: AD_AND_ANALYTICS_HOSTS,

    retries: { runMode: 2, openMode: 0 },

    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return require('@cypress/grep/plugin').plugin(config);
    },
  },
});
