import mongoose from "mongoose";


const bankDetailSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    bName: String,
    accountNumber: String,
    accountHolder: String,
    sortCode: String,
});

export default mongoose.model("BankDetails", bankDetailSchema);  