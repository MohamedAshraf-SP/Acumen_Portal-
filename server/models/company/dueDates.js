import mongoose from "mongoose";

const dueDateSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",

    },
    companyEmail:String,
    vatNumber: String,
    VATRegistered:Boolean,
    vatReturnsPeriod: String, // annual, quarterly
    quarter1DueBy:{
  type: Date,
  default: null
},
    quarter2DueBy: {
  type: Date,
  default: null
},
    quarter3DueBy:{
  type: Date,
  default: null
},
    quarter4DueBy: {
  type: Date,
  default: null
},
    confirmationStatementDueBy:{
  type: Date,
  default: null
},
    AccountsDueBy:{
  type: Date,
  default: null
},
    annualVatDueBy: {
  type: Date,
  default: null
},
   
}, { timestamps: true })
export default mongoose.model('DueDate', dueDateSchema) 
