import axios from 'axios';

const domainUrl = 'https://api.restful-api.dev';

export async function createObject() {
  const name = Date.now().toString();

  try {
    const response = await axios.post(
      `${domainUrl}/objects`,
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
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
}
