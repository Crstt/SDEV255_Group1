const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Course = require('./models/course');
const path = require("path")

const Options = require('./classes/options');
const User = require('./classes/user');

const optionsFile = 'options.txt';
const options = new Options(optionsFile);
const user = new User("johnDoe", "johndoe@example.com", false);
const app = express();
const dbURI = `mongodb+srv://${options.user}:${options.password}@cluster0.zqw4cyc.mongodb.net/Cluster0?retryWrites=true&w=majority`;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

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

app.get('/courses', (req, res) => {
  Course.find()
    .then(result => {
      res.render('index', { Courses: result, title: 'All Courses' , user : req.user});
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/courses/create', (req, res) => {
  res.render('create', { title: 'Create a new course', user : req.user});
});

app.post('/courses', (req, res) => {
  // console.log(req.body);
  const course = new Course(req.body);

  course.save()
    .then(result => {
      res.redirect('/courses');
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/courses/:id', (req, res) => {
  const id = req.params.id;
  Course.findById(id)
    .then(result => {
      res.render('details', { course: result, title: 'Course Details', user : req.user});
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete('/courses/:id', (req, res) => {
  const id = req.params.id;

  Course.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/courses' });
    })
    .catch(err => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404', user : req.user});
});