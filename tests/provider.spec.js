const { Verifier } = require('@pact-foundation/pact');
const path = require('path');

const verifier = new Verifier({
  provider: 'ObjectService',
  logLevel: 'DEBUG',
    providerBaseUrl: 'https://api.restful-api.dev',
    pactUrls: [`${path.resolve(process.cwd(), 'tests', 'pacts')}/Caller-ObjectService.json`],
    
});

describe('Pact Verification', () => {
  it('Contract verification between Caller and ObjectsService', async () => {
    return await verifier.verifyProvider().then(output => {
      console.info('Pact Verification Complete!');
      console.info(output);
    }
  );
  });
}
);