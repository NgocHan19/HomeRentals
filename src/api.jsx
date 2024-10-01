import axios from 'axios';

const API_URL = 'http://localhost:3001';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProperties = async () => {
  try {
    const response = await axiosInstance.get('/api/can-ho-biet-thu');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

app.get('/api/getChuChoThue', (req, res) => {
  const query = `SELECT * FROM ChuChoThue`;
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching ChuChoThue:', error);
      res.status(500).send({ message: 'Error fetching ChuChoThue' });
    } else {
      res.send(results);
    }
  });
});