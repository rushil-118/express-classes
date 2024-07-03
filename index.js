const express = require('express');
const app = express();
app.use(express.json());

let courses = [
    {id: 1, name: "java"},
    {id: 2, name: "javascript"},
    {id: 3, name: "python"}
];

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

app.get('/courses', (req, res) => {
    res.json(courses);
})

app.post('/courses', (req, res) => {
    
    const receivedData = req.body;
    console.log('Received data:', receivedData);

    const newId = courses.length ? courses[courses.length - 1].id + 1 : 1;

    const newCourse = {
        id: newId,
        name: receivedData.name
    };

    courses.push(newCourse);
    
    res.json({data: courses });
})

app.put('/courses', (req, res) => {
    const courseId = parseInt(req.body.id);
    const updatedData = req.body;

    const course = courses.find(c => c.id === courseId);
    course.name = updatedData.name || course.name;

    res.json({ data: course });
});

app.delete('/courses', (req, res) => {
    const courseId = parseInt(req.body.id);

    const courseIndex = courses.findIndex(c => c.id === courseId);

    courses.splice(courseIndex, 1);

    res.json({ data: courses });
});