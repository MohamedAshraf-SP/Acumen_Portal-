import mongoose, { Schema, model } from "mongoose";
import Company from '../company/company.js';


// create schema
const clientSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  accountantID:{ type: mongoose.Schema.Types.ObjectId, ref: 'Accountant', required: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  notification: { type: Number, required: true, enum: [1, 2, 3] },//1.2.3
  departments: [{
    type: String,
    enum: [
      'Annual accounts, CT and Director department',
      'Finance department',
      'General and administrative matters',
      'Paye, Pension and CIS department department',
      'Self-employed and partnership department',
      'Vat department'
    ],
    required: true
  }],
  companies: [{
    type: mongoose.Types.ObjectId, ref: 'Company',

    required: false
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

clientSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default model("Client", clientSchema);
