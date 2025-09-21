import mongoose from "mongoose";

const Schema = mongoose.Schema;

const applicationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    pdf: {
      url: String,
      publicId: String,
      fileName: String,
      size: Number
    },
    service: { 
      type: String, 
      required: true,
      enum: ["plumber", "electrician", "carpenter", "painter", "gardener", "cleaner"]
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    description: { type: String }, // admin notes / feedback
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User" // admin who reviewed
    },
    rejectionReason: { type: String }
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);

export default Application;
