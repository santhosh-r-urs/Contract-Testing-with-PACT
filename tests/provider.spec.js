import { Verifier } from '@pact-foundation/pact';
import { resolve } from 'path';

const verifier = new Verifier({
  provider: 'ObjectService',
  logLevel: 'ERROR',
  providerBaseUrl: 'https://api.restful-api.dev', // URL of the provider service
  pactUrls: [`${resolve(process.cwd(), 'tests', 'pacts')}/Caller-ObjectService.json`], // Location of the contract file
});

describe('Pact Verification', () => {
  test('Contract verification between Caller and ObjectsService', async () => {
    // Verify each interaction in the contract file
    return await verifier.verifyProvider().then((output) => {
      console.info('Pact Verification Complete!');
      console.info(output);
    });
  });
});
