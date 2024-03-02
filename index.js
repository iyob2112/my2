const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;
const mongoose = require('mongoose');

// Middleware
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON body

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://eyobmulusew:iyobmw123@cluster0.xdtqvnx.mongodb.net/f1', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected successfully to MongoDB');

    // Define schema
    const dataSchema = new mongoose.Schema({
        name: String,
        email: String,
        message: String
    });

    // Define model
    const Data = mongoose.model('Data', dataSchema);

    // Define routes
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    // API endpoint for fetching data
    app.get('/api/data', async (req, res) => {
        try {
            const docs = await Data.find({});
            res.json(docs);
        } catch (err) {
            console.error('Error fetching documents:', err);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });

    // API endpoint for saving data
    app.post('/api/saveData', async (req, res) => {
        const { name, email, message } = req.body;
        const newData = new Data({ name, email, message });

        try {
            await newData.save();
            console.log('Data saved successfully:', newData);
            res.status(200).json({ message: 'Data saved successfully' });
        } catch (err) {
            console.error('Error saving data:', err);
            res.status(500).json({ message: 'Failed to save data' });
        }
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
