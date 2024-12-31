import mongoose from 'mongoose';

const tasksDocumentSchema = new mongoose.Schema({
  clientID: { type: mongoose.Types.ObjectId, required: true },
  department: {
    type: String,
    enum: [
      'Annual accounts, CT and Director department',
      'Finance department',
      'General and administrative matters',
      'Paye, Pension and CIS department department',
      'Self-employed and partnership department',
      'Vat department'
    ], required: true
  },
  clientName: { type: String, required: true },
  companyName: { type: String },
  path: { type: String, required: true },
  title: { type: String },
  dateTime: { type: Date, required: true, default: Date.now }, // Stores the date and time
  status: {
    type: String,
    enum: ["pending", "seen", "downloaded"], // Restricts status values
    default: 'seen'
  },
  userKey: { type: String, required: true, default: "000" }, // Unique identifier for the user
  lastUpdate: { type: Date, default: Date.now }, // Tracks last updated time
  accountantName: { type: String, required: true, default: "NONE" },
  action: {
    type: String,
    enum: ['pending', 'seen', 'finished'],
    default: 'seen',// Restricts action values
    required: true
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

export default mongoose.model('TasksDocument', tasksDocumentSchema);
