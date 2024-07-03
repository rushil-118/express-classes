const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'course.json');

app.use(express.json());
app.use(logger);
app.use(middleware);

function readCourses() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading courses data:', error);
        return [];
    }
}

function writeCourses(courses) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(courses, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing courses data:', error);
    }
}

app.get('/courses', (req, res) => {
    const courses = readCourses();
    res.json(courses);
});

app.post('/courses', (req, res) => {
    const courses = readCourses();
    let newCourse = { id: courses.length + 1, name: req.body.name };
    courses.push(newCourse);
    writeCourses(courses);
    res.send(courses);
});

app.put('/courses/:id', (req, res) => {
    try {
        let courses = readCourses();
        let singleCourse = courses.find(course => course.id === parseInt(req.params.id));
        if (!singleCourse) {
            res.status(404).send('Course does not exist');
            return;
        }
        singleCourse.name = req.body.name;
        writeCourses(courses);
        res.send(singleCourse);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/courses', (req, res) => {
    const courseId = parseInt(req.body.id);
    let courses = readCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);

    if (courseIndex !== -1) {
        courses.splice(courseIndex, 1);
        writeCourses(courses);
        res.json({ data: courses });
    } else {
        res.status(404).send('Course not found');
    }
});

function middleware(req, res, next) {
    console.log("called middleware");
    next();
}

function logger(req, res, next) {
    const method = req.method;
    const ip = req.ip;
    const hostname = req.hostname;
    const date = new Date().toISOString();
    console.log(`${method} request from ${ip} (hostname: ${hostname}) at Date: ${date}`);
    next();
}

const PORT = 2000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});