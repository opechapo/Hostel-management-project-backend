const asyncHandler = require("express-async-handler");
const Student = require("../models/StudentModel");
const Room = require("../models/RoomModel");



const date = new Date();
const formatDate = (input) => {
  return input > 9 ? input : `0${input}`
}

const formatHour = (input) => {
  return input > 12 ? input - 12 : input;
}

const format = {
  dd: formatDate(date.getDate()),
  mm: formatHour(date.getMonth() + 1),
  yyyy: formatDate(date.getFullYear()),

  HH: formatDate((date.getHours())),
  hh: formatDate(formatHour(date.getHours())),

  MM: formatDate(date.getMinutes()),
  SS: formatDate(date.getSeconds()),

}

const format24Hour = ({dd, mm, yyyy, HH, MM, SS}) => {
  return `${mm}/${dd}/${yyyy} ${HH}:${MM}:${SS}`;
}

const registerStudent = asyncHandler(async (req, res) => {
  try {
    const { email, name, age, nationality, g_name, g_email, gender, roomNum } =
      req.body;

    if (!email || !name || !age || !nationality || !g_name || !g_email || !gender || !roomNum) {
      return res.status(400).json({ message: "All fields are required" });
    }



    const studentExist = await Student.findOne({ email });

    if (studentExist) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const room = await Room.findOne({ roomNumber: roomNum });

    if (!room) {
      return res.status(400).json({ message: "Room is not available" });
    }

    if (room.roomStatus !== "available") {
      return res.status(400).json({ message: "Room is not available" });
    }

    const student = await Student.create({
      email,
      name,
      age,
      nationality,
      guardian: {
        guardianName: g_name,
        guardianEmail: g_email,
      },
      gender,
      room: room._id,
      checkedIn: true,
      checkedInTime: new Date(),
    });
    room.roomOccupancy.push(student._id);

    if (room.roomOccupancy.length >= room.roomCapacity) {
      room.roomStatus = "Unavailable";
    }
    await room.save();
    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});



const getAllStudents = asyncHandler(async (req,res) => {
  //Find all students and sort them in descending order

  try {
    const students = await Student.find().sort('-createdAt')
  if(!students){
    return res.status(404).json({message: "No students found"})
  }
  res.status(200).json(students);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
  
});



const getStudent = asyncHandler(async (req,res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);
    if (student) {
      return res.status(200).json(student);
    } else{
      return res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
})



const updateStudentProfile = asyncHandler(async (req,res) => {
  try {
    const studentId = req.params.studentId;
  const {name,age,nationality,g_name,g_email} = req.body;
  const student = await Student.findById(studentId);
  if(!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  student.name = name || student.name
  student.age = age || student.age
  student.nationality = nationality || student.nationality
  student.guardian.guardianName = g_name || student.guardian.guardianName
  student.guardian.guardianEmail = g_email || student.guardian.guardianEmail

  const updatedStudent = await student.save()
  res.status(200).json(updatedStudent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
  

})



const changeStudentRoom = asyncHandler(async(req,res)=>{
  const { studentId , newRoomNum} = req.body;
  try {
    const student = await Student.findById(studentId);
    if(!student){
      return res.status(404).json({ message: "Student not found" });
    }
    const currentRoom = await Room.findById(student.room);
    currentRoom.roomOccupancy = currentRoom.roomOccupancy.filter((
      occupant) => occupant.toString() != studentId);

      //If length of current room is less that its capacity, change its status
      if(currentRoom.roomOccupancy.length < currentRoom.roomOccupancy){
        currentRoom.roomStatus = "available";
      }
      await currentRoom.save();

      const newRoom = await Room.findOne({roomNumber: newRoomNum})
      if(!newRoom){
        return res.status(404).json({ message: "New room not found" });
      }
      student.room = newRoom._id
      newRoom.roomOccupancy.push(student._id);
      if (
        newRoom.roomOccupancy.length >= newRoom.roomCapacity) {
          newRoom.roomStatus = "Unavailable";
        }
      
  await newRoom.save();
  await student.save();
  res.status(200).json({ message: "Room changed successfully", student, newRoom})

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
});



const updateCheckInStatus = asyncHandler(async (req,res) => {
  try{
  const {studentId, action, roomNumber} = req.body;

  const student = await Student.findById(studentId);

  if(!student){
    return res.status(404).json({ message: "Student not found" });
  }
  if(action === "checkIn"){
    student.checkedIn = true;
    student.checkedInTime = format24Hour(format);
  }else if(action === "checkOut"){
    student.checkedIn = false;
    student.checkedOutTime = format24Hour(format);
  }else {
    return res.status(400).json({ message: "Invalid action" });
  }

  const room = await Room.findOne({roomNumber});
  if(!room){
    return res.status(404).json({ message: "Room not found" });
  }
  if(action === "checkIn"){
    room.roomOccupancy.push(studentId);
    await room.save();
    await student.save();
    res.status(200).json({ message: "Student checked in"})


  }else if(action === "checkOut"){
    const filteredStudent = room.roomOccupancy.filter((stdtId) => stdtId != studentId);
    room.roomOccupancy = filteredStudent;

    await room.save();

    await student.save();
    res.status(200).json({ message: "Student checked out"})

    }

   
}  catch (error) {
  console.log(error);
  res.status(500).json({ message: "Internal Server Error" });
}

});




const deleteStudent = asyncHandler(async (req,res) => {
  const {studentId} = req.params;

  const student = await Student.findById(studentId);
  
  if(!student){
    return res.status(404).json({ message: "Student not found" });
  }
 
  const studentRoom = await Room.findById(student.room);

  if(studentRoom && student){
    studentRoom.roomOccupancy = studentRoom.roomOccupancy.filter((occupant) => occupants.toString != studentId);

    await studentRoom.save();
    await student.save();

    return res.status(200).json("student successfully deleted");
  }else{
    return res.status(400).json({msg: "Bad request "})
  }

})


module.exports = { registerStudent, getAllStudents,getStudent,updateStudentProfile,changeStudentRoom,updateCheckInStatus,deleteStudent };
