import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
    emailedTo: { type: String, required: true }, // Recipient email address
    emailSubject: { type: String, required: true }, // Subject of the email
    clientName: { type: String, }, // Client name
    companyName: { type: String }, // Company name
    date: { type: Date, required: true, default: Date.now }, // Date when the email was sent
    deadline: { type: Date }, // Deadline for the task or action
    period: { type: String }, // Period for the task (e.g., "monthly", "quarterly")
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

export default mongoose.model('EmailLog', emailLogSchema);

