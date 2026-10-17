
import mongoose from "mongoose";

const refreshSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // SHA-256 hash of the opaque refresh token, never the raw token.
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    familyId: {
      type: String,
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    replacedByTokenHash: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// MongoDB eventually removes expired records.
// Application code must still check expiresAt before accepting a token.
refreshSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.models.RefreshSession ||
  mongoose.model("RefreshSession", refreshSessionSchema);
