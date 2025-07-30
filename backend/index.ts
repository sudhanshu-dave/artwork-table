import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: true 
}));

const PORT = process.env.PORT || 3000;

app.get('/api/artworks', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    const response = await axios.get('https://api.artic.edu/api/v1/artworks', {
      params: { page, limit }
    });

    const artworks = response.data.data;
    const pagination = response.data.pagination;

    res.json({
      data: artworks,
      total: pagination.total,
    });
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
