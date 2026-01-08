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
    quarter1DueBy: Date|null,
    quarter2DueBy: Date|null,
    quarter3DueBy: Date|null,
    quarter4DueBy: Date|null,
    confirmationStatementDueBy: Date|null,
    AccountsDueBy: Date|null,
    annualVatDueBy: Date|null,
   
}, { timestamps: true })
export default mongoose.model('DueDate', dueDateSchema) 
