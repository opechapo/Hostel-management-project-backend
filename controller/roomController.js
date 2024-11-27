const asyncHandler = require("express-async-handler");
const Room = require("../models/RoomModel");

const createNewRoom = asyncHandler(async (req, res) => {
  const { roomNum, roomCapacity, roomLocation, roomOccupancy, roomStatus } =
    req.body;

  try {
    if (!roomNum || !roomCapacity || !roomLocation) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const roomExist = await Room.findOne({ roomNumber: roomNum });

    if (roomExist) {
      return res.status(400).json({ message: "Room already exist" });
    }

    const room = await Room.create({
      roomNumber: roomNum,
      roomCapacity,
      roomLocation,
    });
    res.status(201).json(room);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});






const getAllRooms = asyncHandler(async (req, res) => {
  try {
    const rooms = await Room.find().sort("-createdAt");
    if (!rooms) {
      return res.status(404).json({ message: "No rooms found" });
    }
    res.status(200).json(rooms);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    
}
})

const getRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

const deleteRoom = asyncHandler(async (req, res) => {
 try {
  const { roomId } = req.params;
  const room = await Room.findById(roomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  await room.deleteOne();
  res.status(200).json({ message: "Room deleted successfully" });
 }catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
 }
});


module.exports = { createNewRoom,getAllRooms,getRoom,deleteRoom };
