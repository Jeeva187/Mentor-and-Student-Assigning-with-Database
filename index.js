const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/assign_mentor_db', { useNewUrlParser: true, useUnifiedTopology: true });

// Create mongoose models for Mentor and Student
const Mentor = mongoose.model('Mentor', { name: String });
const Student = mongoose.model('Student', { name: String, mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' } });

app.use(bodyParser.json());

// API to create Mentor
app.post('/api/mentors', async (req, res) => {
  const { name } = req.body;
  const mentor = new Mentor({ name });

  try {
    await mentor.save();
    res.status(201).json(mentor);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to create Student
app.post('/api/students', async (req, res) => {
  const { name } = req.body;
  const student = new Student({ name });

  try {
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to Assign a student to Mentor
app.put('/api/assign/:mentorId/:studentId', async (req, res) => {
  const { mentorId, studentId } = req.params;

  try {
    const mentor = await Mentor.findById(mentorId);
    const student = await Student.findByIdAndUpdate(studentId, { mentor: mentorId }, { new: true });

    res.status(200).json({ mentor, student });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add more APIs based on your requirements

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
