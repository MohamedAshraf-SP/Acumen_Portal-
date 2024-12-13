import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Name of the template (e.g., "Welcome Email")
  subject: { type: String, required: true }, // The subject of the email
  content: { type: String, required: true }, // The content of the email (HTML or plain text)
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the template was created
  updatedAt: { type: Date, default: Date.now }, // Timestamp for when the template was last updated
});

emailTemplateSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);

export default EmailTemplate;
