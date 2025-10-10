/*
 UserName: req.body.UserName,
position: req.body.position,
rating: req.body.rating,
Review: req.body.Review,

*/
import mongoose, { Schema, model } from "mongoose";


// create schema
const accountantSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String , required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  department: {
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
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

accountantSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default model("Accountant", accountantSchema);
