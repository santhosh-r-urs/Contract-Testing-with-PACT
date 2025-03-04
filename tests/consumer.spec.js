import { Pact, Matchers } from '@pact-foundation/pact';
const { like, string } = Matchers;
import axios from 'axios';
import { resolve } from 'path';
import { Agent } from 'http';
import { Agent as _Agent } from 'https';
import { createObject } from './helpers/prerequisites';

const axiosInstance = axios.create({
  timeout: 10000,
  httpAgent: new Agent({ keepAlive: false }), // This is required as Axios by default keeps all connections open
  httpsAgent: new _Agent({ keepAlive: false }),
});

const provider = new Pact({
  consumer: 'Caller', // Name of my consumer service
  provider: 'ObjectService', // Name of my provider service
  dir: resolve(process.cwd(), 'tests', 'pacts'), // Directory where contract files will be saved
  logLevel: 'ERROR',
  spec: 2,
  pactfileWriteMode: 'update',
});

beforeAll(async () => {
  await provider.setup(); // Start the mock provider
});
afterEach(async () => {
  await provider.verify(); // Verify that the interactions defined in the consumer test actually took place
});
afterAll(async () => {
  await provider.finalize(); // Completes writing the contract file and shuts down the mock provider
});

describe('Consumer side contract test', () => {
  test('List an object by id - (GET)', async () => {
    // Define the expected interaction
    await provider.addInteraction({
      state: 'Object exists',
      uponReceiving: 'a request to list an object by id',
      withRequest: {
        method: 'GET',
        path: '/objects/ff808181932badb601955b5119df5f2a',
        headers: { Accept: 'application/json' },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: 'ff808181932badb601955b5119df5f2a',
          name: string('Apple MacBook Pro 16'),
          data: like({
            year: 2019,
            price: 1849.99,
            'CPU model': 'Intel Core i9',
            'Hard disk size': '1 TB',
          }),
        },
      },
    });

    // Make an actual request to the mock provider
    const response = await axiosInstance.get(
      `${provider.mockService.baseUrl}/objects/ff808181932badb601955b5119df5f2a`,
      {
        headers: { Accept: 'application/json' },
      }
    );

    // Response assertion against mock provider
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      id: 'ff808181932badb601955b5119df5f2a',
      name: 'Apple MacBook Pro 16',
      data: {
        year: 2019,
        price: 1849.99,
        'CPU model': 'Intel Core i9',
        'Hard disk size': '1 TB',
      },
    });
  });

  test('Add an object - (POST)', async () => {
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
          name: name,
          data: {
            source: 'manual',
            year: 2025,
          },
        },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: string('ff808181932badb601955b5119df5f2a'),
          name: name,
          data: {
            source: 'manual',
            year: 2025,
          },
        },
      },
    });

    // Make an actual request to the mock provider
    const response = await axiosInstance.post(
      `${provider.mockService.baseUrl}/objects`,
      {
        name: name,
        data: {
          source: 'manual',
          year: 2025,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Response assertion against mock provider
    expect(response.status).toBe(200); // Should ideally be 201
    expect(response.data).toEqual({
      id: 'ff808181932badb601955b5119df5f2a',
      name: name,
      data: {
        source: 'manual',
        year: 2025,
      },
    });
  });

  test('Update an object - (PUT)', async () => {
    const createObjectResponse = await createObject();
    const objectId = createObjectResponse.id;
    const timeUpdated = Date.now().toString();

    // Define the expected interaction
    await provider.addInteraction({
      state: 'An object exists',
      uponReceiving: 'a request to update the object',
      withRequest: {
        method: 'PUT',
        path: `/objects/${objectId}`,
        headers: { 'Content-Type': 'application/json' },
        body: {
          name: createObjectResponse.name,
          data: {
            source: 'manual',
            year: 2025,
            lastUpdated: timeUpdated,
          },
        },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: like({
          id: string('ff808181932badb601955b5119df5f2a'),
          name: createObjectResponse.name,
          data: {
            source: 'manual',
            year: 2025,
            lastUpdated: timeUpdated,
          },
        }),
      },
    });

    // Make an actual request to the mock provider
    const response = await axiosInstance.put(
      `${provider.mockService.baseUrl}/objects/${objectId}`,
      {
        name: createObjectResponse.name,
        data: {
          source: 'manual',
          year: 2025,
          lastUpdated: timeUpdated,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Response assertion against mock provider
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      id: 'ff808181932badb601955b5119df5f2a',
      name: createObjectResponse.name,
      data: {
        source: 'manual',
        year: 2025,
        lastUpdated: timeUpdated,
      },
    });
  });

  test('Partially update an object- (PATCH)', async () => {
    const createObjectResponse = await createObject();
    const objectId = createObjectResponse.id;

    // Define the expected interaction
    await provider.addInteraction({
      state: 'An object exists',
      uponReceiving: 'a request to partically update the object',
      withRequest: {
        method: 'PATCH',
        path: `/objects/${objectId}`,
        headers: { 'Content-Type': 'application/json' },
        body: {
          name: `${createObjectResponse.name}_partially_updated`,
        },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: like({
          id: 'ff808181932badb601955b5119df5f2a',
          name: `${createObjectResponse.name}_partially_updated`,
          data: {
            source: 'manual',
            year: 2025,
          },
        }),
      },
    });

    // Make an actual request to the mock provider
    const response = await axiosInstance.patch(
      `${provider.mockService.baseUrl}/objects/${objectId}`,
      {
        name: `${createObjectResponse.name}_partially_updated`,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Response assertion against mock provider
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      id: 'ff808181932badb601955b5119df5f2a',
      name: `${createObjectResponse.name}_partially_updated`,
      data: {
        source: 'manual',
        year: 2025,
      },
    });
  });

  test('Delete an object - (DELETE)', async () => {
    const createObjectResponse = await createObject();
    const objectId = createObjectResponse.id;

    // Define the expected interaction
    await provider.addInteraction({
      state: 'An object exists',
      uponReceiving: 'a request to delete the object',
      withRequest: {
        method: 'DELETE',
        path: `/objects/${objectId}`,
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: like({
          message: 'Object with id = ff808181932badb6019560aeba2a6b25 has been deleted.',
        }),
      },
    });

    // Make an actual request to the mock provider
    const response = await axiosInstance.delete(
      `${provider.mockService.baseUrl}/objects/${objectId}`
    );

    // Response assertion against mock provider
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      message: 'Object with id = ff808181932badb6019560aeba2a6b25 has been deleted.',
    });
  });

  test('List all objects - (GET)', async () => {
    // Define the expected interaction
    await provider.addInteraction({
      state: 'Objects exists',
      uponReceiving: 'a request to list all objects',
      withRequest: {
        method: 'GET',
        path: '/objects',
        headers: { Accept: 'application/json' },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: like([
          {
            id: '1',
            name: 'Google Pixel 6 Pro',
          },
          {
            id: '2',
            name: 'Apple iPhone 12 Mini, 256GB, Blue',
          },
        ]),
      },
    });

    // Make an actual request to the mock provider
    const response = await axiosInstance.get(`${provider.mockService.baseUrl}/objects`, {
      headers: { Accept: 'application/json' },
    });

    // Response assertion against mock provider
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      {
        id: '1',
        name: 'Google Pixel 6 Pro',
      },
      {
        id: '2',
        name: 'Apple iPhone 12 Mini, 256GB, Blue',
      },
    ]);
  });
});
