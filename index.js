const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const courseRoutes = require('./routes/courseRoutes');


const Options = require('./classes/options');
const User = require('./classes/user');

const optionsFile = 'options.txt';
const options = new Options(optionsFile);
const user = new User("johnDoe", "johndoe@example.com", false);
const app = express();
const dbURI = `mongodb+srv://${options.user}:${options.password}@cluster0.zqw4cyc.mongodb.net/ScheduleBuilder?retryWrites=true&w=majority`;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');
app.use(express.json());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
app.use("/css", express.static("./node_modules/bootstrap/dist/css"))
app.use("/js", express.static("./node_modules/bootstrap/dist/js"))

// routes
app.get('/', (req, res) => {
  res.redirect('/courses');
});

app.use('/courses', courseRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404', user : req.user});
});