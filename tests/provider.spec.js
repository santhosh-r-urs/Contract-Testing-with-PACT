import { Verifier } from '@pact-foundation/pact';
import { resolve } from 'path';

const verifier = new Verifier({
  provider: 'ObjectService',
  logLevel: 'DEBUG',
  providerBaseUrl: 'https://api.restful-api.dev',
  pactUrls: [`${resolve(process.cwd(), 'tests', 'pacts')}/Caller-ObjectService.json`],
});

describe('Pact Verification', () => {
  test('Contract verification between Caller and ObjectsService', async () => {
    return await verifier.verifyProvider().then((output) => {
      console.info('Pact Verification Complete!');
      console.info(output);
    });
  });
});
