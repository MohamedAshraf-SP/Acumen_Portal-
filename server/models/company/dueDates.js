import mongoose from "mongoose";

const dueDateSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",

    },
    vatNumber: String,
    vatReturnsPeriod: String, // annual, quarterly
    quarter1DueBy: Date,
    quarter2DueBy: Date,
    quarter3DueBy: Date,
    quarter4DueBy: Date,
    confirmationStatementDueBy: Date,
    AccountsDueBy: Date,
    annualVatDueBy: Date,
   
}, { timestamps: true })
export default mongoose.model('DueDate', dueDateSchema) 
