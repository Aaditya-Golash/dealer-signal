import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('DealerSignal API');
});

app.listen(PORT, () => {
    console.log('DealerSignal API running on http://localhost:${PORT}');
});