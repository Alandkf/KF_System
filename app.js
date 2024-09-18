const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sequelize } = require('./models');
// routes
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
console.log("payment routes imported");


// const cors = require('cors');
const methodOverride = require('method-override');
require('dotenv').config();
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());

// View engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Routes
app.use('/students', studentRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/payments', paymentRoutes);

app.get('/', (req, res) => {
    res.render('index');
});
let port = process.env.PORT || 3033;
// Sync database and start server
//{ force: true }
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error('Unable to sync database:', err);
});

module.exports = app;