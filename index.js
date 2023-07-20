const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

const cookieParser = require('cookie-parser');
const { checkUser } = require('./middleware/authMiddleware');

const Options = require('./classes/options');

const optionsFile = 'options.txt';
const options = new Options(optionsFile);
const app = express();
const dbURI = `mongodb+srv://${options.user}:${options.password}@cluster0.zqw4cyc.mongodb.net/ScheduleBuilder?retryWrites=true&w=majority`;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');
app.use(express.json());

app.use(express.static('public'));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
app.use("/css", express.static("./node_modules/bootstrap/dist/css"))
app.use("/js", express.static("./node_modules/bootstrap/dist/js"))

// routes

app.get('*', checkUser);
app.get('/', (req, res) => {
  res.redirect('/courses');
});

app.use('/courses', courseRoutes);
app.use(authRoutes);
app.use('/schedule', scheduleRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404', user : req.user});
});

// 500 page
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).render('404', { title: '500', user : req.user});
});