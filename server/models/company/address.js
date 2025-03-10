import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    businessAddress: String,
    registeredOfficeAddress: String,
    telephone: Number,
    email: String,
    website: String,
});

export default mongoose.model('Address', addressSchema)
