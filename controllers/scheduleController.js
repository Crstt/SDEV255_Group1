const { find } = require('lodash');
const Course = require('../models/course');
const User = require('../models/User');


const schedule_index = (req, res) => {
    Course.find({ _id: { $in: res.locals.user.schedule } })
        .then(courses => {
            res.render('schedule', { Courses: courses, title: 'My Schedule'});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Internal server error." });
        });
}

const add_course = (req, res) => {
    const id = req.params.id;
    User.findOneAndUpdate({ _id: res.locals.user._id }, { $push: { schedule: id } }, { upsert: true })
        .then(result => {
            res.redirect('/schedule');
        },
        err => {
            console.log(err);
            res.status(500).json({ error: "Internal server error." });
        }
    );    
}

const remove_course = (req, res) => {
    const id = req.params.id;
    User.findOneAndUpdate({ _id: res.locals.user._id }, { $pull: { schedule: id } }, { upsert: true })
        .then(result => {
            res.redirect('/schedule');
        },
        err => {
            console.log(err);            
            res.status(500).json({ error: "Internal server error." });
        }
    );  
}

module.exports = {
    schedule_index,
    add_course,
    remove_course
}