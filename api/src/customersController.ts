
import { supabase } from './supabaseClient';
import { Request, Response } from 'express';


export const createCustomer = async (req: Request, res: Response) => {
    const { name, birthdate, contact_number } = req.body;

    if (!name || !birthdate || !contact_number) {
        return res.status(400).json({ error: 'Missing required fields: name, birthdate, and contact_number are required.' });
    }

    const { data, error } = await supabase
        .from('customers')
        .insert([{ name, birthdate, contact_number }])
        .select('id');

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    if (!data || data.length === 0) {
        return res.status(400).json({ error: 'Customer not created' });
    }

    res.status(201).json({
        id: data[0].id,
        message: 'Customer successfully created',
    });
};

export const getAllCustomers = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('*');

        if (error) {
            console.error('Error fetching customers:', error.message);
            return res.status(500).json({ error: 'Internal Server Error: Unable to fetch customers' });
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Internal Server Error: Unexpected error occurred' });
    }
};


export const getCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'Invalid or missing customer ID' });
    }
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            console.error('Error fetching customer:', error.message);
            return res.status(500).json({ error: 'Internal Server Error: Unable to fetch customer' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Internal Server Error: Unexpected error occurred' });
    }
};

export const updateCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, birthdate, contact_number } = req.body;
  
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid or missing customer ID' });
    }
  
    if (!name || !birthdate || !contact_number) {
      return res.status(400).json({ error: 'Missing required fields: name, birthdate, and contact_number are required.' });
    }
  
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({ name, birthdate, contact_number })
        .eq('id', id)
        .single();
  
      if (error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        console.error('Error updating customer:', error.message);
        return res.status(500).json({ error: 'Internal Server Error: Unable to update customer' });
      }
      res.status(200).json({
        message: 'Customer successfully updated',
        customer: data
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Internal Server Error: Unexpected error occurred' });
    }
  };


  export const deleteCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid or missing customer ID' });
    }
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
  
      if (error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        console.error('Error deleting customer:', error.message);
        return res.status(500).json({ error: 'Internal Server Error: Unable to delete customer' });
      }

      res.status(204).end();
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Internal Server Error: Unexpected error occurred' });
    }
  };