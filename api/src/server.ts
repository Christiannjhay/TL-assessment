import express, { Request, Response } from 'express';
import { 
  createCustomer, 
  getAllCustomers, 
  getCustomerById, 
  updateCustomerById, 
  deleteCustomerById 
} from './customersController';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/customers', createCustomer);
app.get('/customers', getAllCustomers);
app.get('/customers/:id', getCustomerById);
app.put('/customers/:id', updateCustomerById);
app.delete('/customers/:id', deleteCustomerById);


let counter = 0;
let isLocked = false;

const acquireLock = async (): Promise<void> => {
  while (isLocked) {
    await new Promise(resolve => setTimeout(resolve, 50)); 
  }
  isLocked = true;
};

const releaseLock = (): void => {
  isLocked = false;
};

app.post('/update-counter', async (req: Request, res: Response) => {
  await acquireLock(); 

  try {
    const { incrementBy } = req.body;

    if (typeof incrementBy !== 'number') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    counter += incrementBy;

    res.status(200).json({ counter });
  } finally {
    releaseLock();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export { app };