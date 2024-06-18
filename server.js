const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToServer = require('./database');

const app = express();
const PORT = 5000;

connectToServer();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/api/user', require('./routes/userRoute'));
app.use('/api/projects', require('./routes/projectRoute'));
app.use('/api/category',require('./routes/categoryRoute'))
app.use('/api/products',require('./routes/productsRoute'))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
