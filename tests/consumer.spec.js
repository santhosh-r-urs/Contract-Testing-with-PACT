const { Pact, Matchers } = require('@pact-foundation/pact');
const { like } = Matchers;
const axios = require('axios');
const { url } = require('inspector');
const path = require('path');
const http = require('http');
const https = require('https');

const axiosInstance = axios.create({
  timeout: 10000,
  httpAgent: new http.Agent({ keepAlive: false }),
  httpsAgent: new https.Agent({ keepAlive: false })
});

let mockServerPort;
const provider = new Pact({
  consumer: 'Caller',
  provider: 'ObjectService',
  log: path.resolve(process.cwd(), 'tests','logs/pact.log'),
  dir: path.resolve(process.cwd(), 'tests', 'pacts'),
  logLevel: 'ERROR',
  spec: 2,
  pactfileWriteMode: 'update',
});

beforeAll(async () => {
  await provider.setup();
}
);
afterEach(async () => {
  await provider.verify();
}
);
afterAll(async () => {
  await provider.finalize();
}
);

describe('Consumer side contract test', () => {
  
  test('List an object by id', async () => {
    // Define the expected interaction
    await provider.addInteraction({
      state: 'Object exists',
      uponReceiving: 'a request to list an object by id',
      withRequest: {
        method: 'GET',
        path: '/objects/ff808181932badb601955b5119df5f2a',
        headers: { Accept: 'application/json' }
        },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: like({
          "id": "ff808181932badb601955b5119df5f2a",
          "name": "Apple MacBook Pro 16",
          "data": {
              "year": 2019,
              "price": 1849.99,
              "CPU model": "Intel Core i9",
              "Hard disk size": "1 TB"
          }
      })
      }
    });

    // Make an actual request to the mock provider 
      const response = await axiosInstance.get(`${provider.mockService.baseUrl}/objects/ff808181932badb601955b5119df5f2a`, {
      headers: { Accept: 'application/json' },
    });
  
    // Assertions
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      "id": "ff808181932badb601955b5119df5f2a",
      "name": "Apple MacBook Pro 16",
      "data": {
          "year": 2019,
          "price": 1849.99,
          "CPU model": "Intel Core i9",
          "Hard disk size": "1 TB"
      }});
    
  });

  test('Add an object', async () => {
    const name = Date.now().toString();
    // Define the expected interaction
    await provider.addInteraction({
      state: 'All fields for creating a new object is present',
      uponReceiving: 'a request to create an object with the all fields',
      withRequest: {
        method: 'POST',
        path: '/objects',
        headers: { 'Content-Type': 'application/json' },
        body: {
          "name": name,
          "data": {
              "source": "manual",
              "year": 2025
          }
      }},
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: like({
          "id": "ff808181932badb601955b5119df5f2a",
          "name": "Apple MacBook Pro 16",
          "data": {
              "source": "manual",
              "year": 2025
          }
      })
      }
    });

    // Make an actual request to the mock provider 
      const response = await axiosInstance.post(`${provider.mockService.baseUrl}/objects`, 
      {
        "name": name,
        "data": {
            "source": "manual",
            "year": 2025
        } 
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }, 
  );
  
    // Assertions
    expect(response.status).toBe(200);  // Should ideally be 201
    expect(response.data).toEqual({
      "id": "ff808181932badb601955b5119df5f2a",
          "name": "Apple MacBook Pro 16",
          "data": {
              "source": "manual",
              "year": 2025
          }});
    
  });

});
