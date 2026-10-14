import mongoose from "mongoose";
const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 20
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isReady: {
      type: Boolean,
      default: false
    },
    connected: {
      type: Boolean,
      default: true
    }
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 6,
      maxlength: 6,
      match: /^[A-Z0-9]{6}$/
    },

    hostUserId: {
      type: String,
      required: true
    },

    members: {
      type: [memberSchema],
      validate: {
        validator: (members) => members.length <= 6,
        message: "A room cannot contain more than 6 players"
      }
    },

    settings: {
      minPlayers: {
        type: Number,
        default: 3
      },
      maxPlayers: {
        type: Number,
        default: 6
      }
    },

    status: {
      type: String,
      enum: ["waiting", "in-progress", "finished"],
      default: "waiting"
    },

    activeGameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      default: null
    }
  },
  { timestamps: true }
);

roomSchema.index({ code: 1 }, { unique: true });

const Room = mongoose.model("Room", roomSchema);

export default Room;
