// import express from 'express'


// const mongoose = require('mongoose');
// const Room = require('./models/hotel-model.js');
// const RoomType = require('./models/hotel-model.js'); // Ensure the imported model is Course

// //const express = require ('express')
// const { Db } = require('mongodb');

// //const {Room, RoomType} = require('./models/hotel-model.js');


// const app = express ();
// const port = process.env.port ||3000;


const mongoose = require('mongoose');
const { Room, RoomType } = require('./models/hotel-model.js');
const dotenv = require('dotenv');
const roomTypesRouter = require('./routes/roomTypes');

const express = require('express');
const { Db } = require('mongodb');
const app = express();



const port = process.env.port || 3000


// Load environment variables from .env file
dotenv.config();

//MIDDLEWARE
app.use(express.json());



//Testing route
app.get('/', (req,res) =>{
  res.send('welcome to my Api Node server')

});



//ROUTES FOR ROOM TYPE

//POST
//posting Room-types
app.post('/api/rooms-type', async (req, res) => {
  try {
      const roomType = await RoomType.create(req.body); 
      res.status(200).json(roomType); 
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

//Getting all Room-types
app.get('/api/rooms-types', async (req,res)=>{
  try{
      const roomType = await RoomType.find({});
      res.status(200).json(roomType)

  } catch (error){
      res.status(500).json({message: error.message});
  }
});



// ROUTES FOR ROOMS


//posting to Room
app.post('/api/rooms', async (req, res) => {
  try {
      const newRoom = await Room.create(req.body); 
      res.status(200).json(newRoom); 
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

//GET
//Getting the entire rooms with filter

app.get('/api/rooms', async (req, res) => {
  try {
      const { search, type, minPrice = 0, maxPrice } = req.query;
      const query = {};

      // Filter conditions
      if (search) {
          query.name = new RegExp(search, "i");
      }
      if (type) {
          query.roomType = type;
      }
      if (minPrice || maxPrice) {
          query.price = {
              $gte: Number(minPrice),
              $lte: Number(maxPrice || Infinity)
          };
      }

      // Fetch search result from database collection using Mongoose model
      // Fetch rooms with populated room type
      const rooms = await Room.find(query)
      res.status(200).json(rooms);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


app.get('/api/rooms/:id', async (req, res)=>{
  try{
      const room = await Room.findById(req.params.id);

      if(!room) {
          return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json(room)

  } catch (error){
      res.status(500).json({message: error.message});
  }
})




//patching from room 
app.patch('/api/rooms/:id', async (req,res)=>{
  try {
      const updateRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

      if (!updateRoom) {
          return res.status(404).json({ message: 'Course with the specified ID not found!' });
      }

      // Return the updated course
      res.status(200).json(updateRoom);
  } catch (error) {
      // Handle any errors, such as invalid _id format or validation errors
      res.status(400).json({ message: error.message });
  }
});


//delete room
app.delete('/api/rooms/:id', async (req, res) => {
  try {
      const deletedRoom = await Room.findByIdAndDelete(req.params.id);

      if (!deletedRoom) {
          return res.status(404).json({ message: 'Room with the specified ID not found!' });
      }

      res.status(200).json({ message: 'Room deleted successfully!', room: deletedRoom });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});













mongoose.connect('mongodb+srv://cek:browseit@cluster0.ztwid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to the Database!'))
  .catch(() => console.log('connection failed', error));

app.listen (port,()=> {console.log(`server is running on http://localhost:${port}`);;});