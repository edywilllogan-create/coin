import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  // Apenas aceita pedidos POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = request.body;

  if (!email || !email.includes('@')) {
    return response.status(400).json({ error: 'Invalid email' });
  }

  try {
    // Insere o soldado na tabela de recrutamento SQL
    await sql`INSERT INTO Soldiers (email, joined_at) VALUES (${email}, NOW());`;
    
    return response.status(200).json({ message: 'Stored in SQL' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Database connection failed' });
  }
}