const mongoose = require('mongoose');

const guardianSchema = new mongoose.Schema({
  guardianName: {
    type: String,
    required: true
  },
  guardianEmail: {
    type: String,
    required: [true, "Please enter your email"],
    trim: true
  },
  
})

const studentSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  age:{
   type: Number,
   required: true,
  },
  gender:{
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  nationality:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: [true, "Please enter your email"],
    trim: true,
    unique: true,
  },
  guardian: guardianSchema,
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: null,
  },
  role: {
    type: String,
    default: 'student',
    enum: ['Student']
  },
  checkedIn: {
    type: Boolean,
    default: false,
  },
  checkedInTime: {
    type: Date,
    default: null,
  },
  checkedOutTime: {
    type: Date,
    default: null,
  }
},
{
  timestamps: true,
})


 

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;