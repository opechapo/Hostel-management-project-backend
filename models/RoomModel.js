const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber:{
    type: Number,
    required: true,
    unique: true
  },
  roomCapacity:{
    type: Number,
    required: true
  },
  roomOccupancy:[
    {
      type: String,
      ref: 'Student',
    }
  ],
  roomLocation:{
    type: String,
    required: true
  },
  roomStatus:{
    type: String,
    default: 'available'
  },

},{
  timestamps: true
})

const Room = mongoose.model('Room', RoomSchema)



module.exports = Room;