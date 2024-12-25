import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name field
    PATH: { type: String, required: true }, // File path or URL (you can also use Buffer if you store the file directly in MongoDB)
    additionalName: { type: String, required: true }, // Another name field (as per your example, it seems there are two name fields)
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the form was submitted
});



export default mongoose.model("Form", formSchema);


