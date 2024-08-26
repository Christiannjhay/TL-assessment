import request from 'supertest';
import { app } from '../src/server';

describe('Concurrency Handling', () => {
  it('should handle concurrent requests and update the counter correctly', async () => {
    const numRequests = 10;
    const incrementBy = 1; 
    const requests = [];

    for (let i = 0; i < numRequests; i++) {
      requests.push(
        request(app)
          .post('/update-counter')
          .send({ incrementBy })
      );
    }

    const responses = await Promise.all(requests);

    responses.forEach(response => {
      expect(response.status).toBe(200);
    });

    const finalResponse = await request(app)
      .post('/update-counter')
      .send({ incrementBy: 0 });

    expect(finalResponse.status).toBe(200);
    expect(finalResponse.body.counter).toBe(numRequests); 
  });
});
