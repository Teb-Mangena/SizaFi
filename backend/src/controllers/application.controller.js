import { v2 as cloudinary } from "cloudinary";
import Application from "../models/application.model.js";
import uploadFromBuffer from "../lib/cloudinary.js";
import User from "../models/user.model.js";

export const applyForRole = async (req, res) => {
  const user = req.user; 
  const pdfFile = req.files?.pdf?.[0];

  try {
    let pdfData = null;

    const existing = await Application.findOne({ userId: user._id, status: "pending" });
    if (existing) {
      return res.status(400).json({ error: "You already have a pending application" });
    }


    if (pdfFile) {
      const pdfResult = await uploadFromBuffer(pdfFile.buffer, {
        resource_type: "raw",
        format: "pdf",
        fileName: pdfFile.originalname.replace(/\.[^/.]+$/, "")
      });

      pdfData = {
        url: pdfResult.secure_url,
        publicId: pdfResult.public_id,
        fileName: pdfFile.originalname,
        size: pdfResult.bytes
      };
    }

    if (!pdfData) {
  return res.status(400).json({ error: "PDF document is required" });
}


    const newApplication = new Application({
      userId: user._id,
      fullname: user.fullname,
      email: user.email,
      pdf: pdfData,
      service: req.body.service, // role they want
      status: "pending"
    });

    await newApplication.save();

    res.status(201).json({
      ...newApplication.toObject(),
      pdf: pdfData
        ? {
            ...newApplication.pdf,
            downloadUrl: `${pdfData.url}?dl=${encodeURIComponent(pdfData.fileName)}.pdf`
          }
        : null
    });
  } catch (error) {
    console.error("Error in applyForRole:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// User: get my applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// Admin: get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId", "fullname email role")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// Admin: review (approve/reject) an application
export const reviewApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Update application
    application.status = status;
    application.description = description || "";
    application.reviewedBy = req.user._id;
    await application.save();

    // If approved, update the user's role
    if (status === "approved") {
      await User.findByIdAndUpdate(application.userId, {
        role: application.service
      });
    }

    res.json({ message: `Application ${status}`, application });
  } catch (error) {
    console.error("Error reviewing application:", error);
    res.status(500).json({ error: "Failed to review application" });
  }
};

// Admin: get only pending applications
export const getPendingApplications = async (req, res) => {
  try {
    const applications = await Application.find({ status: "pending" })
      .populate("userId", "fullname email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    res.status(500).json({ error: "Failed to fetch pending applications" });
  }
};

