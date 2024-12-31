import mongoose from "mongoose";

const directorSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    dTitle: String,
    dateOfAppointment: Date,
    dateRegistrationForSE: Date,
    dateOfResignation: Date,
    dName: String,
    dDateOfBirth: Date,
    dUTR: String,
    dUTR_ID: String,
    dUTR_Password: String,
    dNIN: String,
});

export default mongoose.model("Director", directorSchema);
