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


app.use(logger_middleware);

function logger_middleware(req, res, next){
    //console.log method, ip, hostname, date
    
    const method = req.method;
    const ip = req.ip;
    const hostname = req.hostname;
    const date = new Date().toISOString();

    console.log(`[${date}] ${method} request from ${hostname} (IP: ${ip})`);

    next(); // Call the next middleware or route handler
    
}

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

app.put('/courses/:id', (req, res) => {
    // const courseId = parseInt(req.body.id);
    // const updatedData = req.body;

    // const course = courses.find(c => c.id === courseId);
    // course.name = updatedData.name || course.name;

    // res.json({ data: course });

    try{
        let SingleCourse = courses.find((course) => {
            return course.id === +req.params.id
        })
        if(!SingleCourse){
            res.status(404).send('course not found');
        }

        SingleCourse.name = req.body.name;
        res.send(courses);
    } catch (err) {
        res.status(500).send(err);
    }

});

app.delete('/courses/:id', (req, res) => {
    // const courseId = parseInt(req.body.id);

    // const courseIndex = courses.findIndex(c => c.id === courseId);

    // courses.splice(courseIndex, 1);

    // res.json({ data: courses });

    try{
        const courseId = parseInt(req.params.id);

        const courseIndex = courses.findIndex(c => c.id === courseId);
        if (courseIndex === -1) {
            return res.status(404).json({ message: 'Course not found' });
        }

        courses.splice(courseIndex, 1);

        res.json({ data: courses });

    } catch (err) {
        res.status(500).send(err);
    }
});


function middleware(req, res, next){
    console.log("called");
    next();
}

