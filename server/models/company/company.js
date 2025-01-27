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


  RMdepartments: { type: mongoose.Schema.Types.ObjectId, ref: "RMdepartments" },
  dueDates: { type: mongoose.Schema.Types.ObjectId, ref: "DueDate" },
  shareholders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shareholder" }],
  directors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Director" }],
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],

});

export default mongoose.model("Company", companySchema);




