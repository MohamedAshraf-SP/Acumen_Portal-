import mongoose from 'mongoose';

const tasksDocumentsSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  companyName: { type: String },
  path:{type:String,required:true},
  title: { type: String },
  dateTime: { type: Date, required: true, default: Date.now }, // Stores the date and time
  status: { 
    type: String, 
    enum: ["pending", "active", "finished"], // Restricts status values
    default: 'pending' 
  },
  userKey: { type: String, required: true }, // Unique identifier for the user
  lastUpdate: { type: Date, default: Date.now }, // Tracks last updated time
  accountantName: { type: String, required: true },
  action: { 
    type: String, 
    enum: ['pending','seen', 'downloaded'], 
    default:'pending',// Restricts action values
    required: true 
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

export default mongoose.model('tasksDocuments', tasksDocumentsSchema);
