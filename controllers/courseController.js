const Course = require('../models/course');
const path = require("path")

const fs = require('fs');
const parse = require('csv-parser');

const courses_index = (req, res) => {
    Course.find()
        .then(result => {
            res.render('index', { Courses: result, title: 'All Courses', user: req.user });
        })
        .catch(err => {
            console.log(err);
        });
}

const courses_create = (req, res) => {
    res.render('create', { title: 'Create a new course', user: req.user });
}

const courses_update_page = (req, res) => {
    const id = req.params.id;
    Course.findById(id)
        .then(result => {
            res.render('update', { course: result, title: 'Course Details', user: req.user });
        })
        .catch(err => {
            console.log(err);
        });
}

const courses_post = (req, res) => {
    const course = new Course(req.body);

    course.save()
        .then(result => {
            res.redirect('/courses');
        })
        .catch(err => {
            console.log(err);
        });
}

const courses_details = (req, res) => {
    const id = req.params.id;
    Course.findById(id)
        .then(result => {
            res.render('details', { course: result, title: 'Course Details', user: req.user });
        })
        .catch(err => {
            console.log(err);
        });
}

const courses_update = (req, res) => {

    const courseId = req.params.id;
    const updatedCourse = {
        name: req.body.name,
        code: req.body.code,
        teacher: req.body.teacher,
        description: req.body.description,
        subjectArea: req.body.subjectArea,
        credits: req.body.credits
    };
    console.log(req.body);

    Course.findOneAndUpdate({ _id: courseId }, updatedCourse, { new: true })
        .then(result => {
            res.json({ redirect: '/courses' });
        })
        .catch(err => {
            console.log(err);
        });
}

const courses_delete = (req, res) => {
    const id = req.params.id;

    Course.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/courses' });
        })
        .catch(err => {
            console.log(err);
        });
}

const courses_mass_add = (req, res) => {
    readCSVAndSaveData();
    res.redirect('/courses');
}

function readCSVAndSaveData() {
    const results = [];
    fs.createReadStream('courses.csv')
        .pipe(parse())
        .on('data', data => results.push(data))
        .on('end', () => {
            saveCoursesToDatabase(results);
        });
}

function saveCoursesToDatabase(coursesData) {
    const courses = coursesData.map(course => {
        return new Course({
            name: course.name,
            code: course.code,
            teacher: course.teacher,
            description: course.description,
            subjectArea: course.subjectArea,
            credits: course.credits
        });
    });

    Course.insertMany(courses)
        .then(result => {
            console.log('Courses saved to the database:', result);
            mongoose.disconnect();
        })
        .catch(err => {
            console.error('Error saving courses to the database:', err);
            mongoose.disconnect();
        });
}

module.exports = {
    courses_index,
    courses_create,
    courses_update_page,
    courses_post,
    courses_details,
    courses_update,
    courses_delete,
    courses_mass_add
}