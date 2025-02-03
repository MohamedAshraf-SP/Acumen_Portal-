import mongoose from "mongoose"
import { DueDate, Shareholder, Director, Address, Document, BankDetail, RMdepartment } from './index.js'
import Client from "../users/clients.js";







const companySchema = new mongoose.Schema({
  //client Data
  clientID: { type: mongoose.Types.ObjectId, ref: "Client" },
  clientName: String,

  companyName: String,
  registrationDate: Date,  
  incorporationDate: Date,//date_of_creation 
  registrationNumber: String,
  AuthCode: String,
  CISRegistrationNumber: String,
  AccountsOfficeReference: String,
  natureOfBusiness: String,
  employerPAYEReference: String,
  status: String,
  corporationTax_UTR: String,
  VATRegistered: Boolean,

  //contact
  contactName: String,
  phone: String,
  entryDate: Date,

  //address
  businessAddress: String,
  registeredOfficeAddress: String,
  telephone: String,
  email: String,
  website: String,

  //bankDetails
  bName: String,
  accountNumber: String,
  accountHolder: String,
  sortCode: String,


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
  dueDates: { type: mongoose.Schema.Types.ObjectId, ref: "DueDate" },
  shareholders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shareholder" }],
  directors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Director" }],
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],

});

export default mongoose.model("Company", companySchema);




