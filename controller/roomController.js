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

module.exports = { createNewRoom };
