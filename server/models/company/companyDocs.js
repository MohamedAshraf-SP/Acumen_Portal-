import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    title: String,
    path: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  export default mongoose.model('Document', documentSchema)   