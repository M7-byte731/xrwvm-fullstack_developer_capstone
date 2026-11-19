const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3030;
app.use(cors());
app.use(express.json());
const Reviews = require('./review');
const Dealerships = require('./dealership');

async function start() {
  const uri = process.env.MONGO_URL || 'mongodb://mongo_db:27017/dealershipsDB';
  await mongoose.connect(uri);
  const seed = async (Model, file, key) => {
    if (await Model.countDocuments() === 0) {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8'));
      await Model.insertMany(data[key]);
    }
  };
  await seed(Dealerships, 'dealerships.json', 'dealerships');
  await seed(Reviews, 'reviews.json', 'reviews');
  app.listen(port, () => console.log(`Dealership API running on port ${port}`));
}
app.get('/', (_req, res) => res.send('Welcome to the Mongoose API'));
app.get('/fetchReviews', async (_req, res) => res.json(await Reviews.find()));
app.get('/fetchReviews/dealer/:id', async (req, res) => res.json(await Reviews.find({ dealership: Number(req.params.id) })));
app.get('/fetchDealers', async (_req, res) => res.json(await Dealerships.find()));
app.get('/fetchDealers/:state', async (req, res) => {
  const state = req.params.state;
  res.json(state.toLowerCase() === 'all' ? await Dealerships.find() : await Dealerships.find({ state: new RegExp(`^${state}$`, 'i') }));
});
app.get('/fetchDealer/:id', async (req, res) => {
  const dealer = await Dealerships.findOne({ id: Number(req.params.id) });
  if (!dealer) return res.status(404).json({ error: 'Dealer not found' });
  res.json(dealer);
});
app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;
    const latest = await Reviews.findOne().sort({ id: -1 });
    const review = await Reviews.create({ ...data, id: latest ? latest.id + 1 : 1 });
    res.status(201).json(review);
  } catch (error) { res.status(400).json({ error: error.message }); }
});
start().catch(error => { console.error('Could not start API:', error); process.exit(1); });
