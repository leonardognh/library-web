//https://github.com/LukasKlement/angular-cypress-coverage-tutorial/tree/main

import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';
import registerCodeCoverageTasks from '@cypress/code-coverage/task';

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  registerCodeCoverageTasks(on, config);
  await addCucumberPreprocessorPlugin(on, config);

  on(
    'file:preprocessor',
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  return config;
}

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: '**/*.feature',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents,
  },
});
