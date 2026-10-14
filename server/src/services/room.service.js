import { randomBytes, randomUUID } from "node:crypto";
import Room from "../models/Room.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const generateRoomCode = () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);

  return Array.from(
    bytes,
    (byte) => characters[byte % characters.length]
  ).join("");
};

const cleanDisplayName = (name) => {
  if (typeof name !== "string") {
    throw createError("Display name is required", 400);
  }

  const displayName = name.trim();

  if (displayName.length < 1 || displayName.length > 20) {
    throw createError(
      "Display name must be between 1 and 20 characters",
      400
    );
  }

  return displayName;
};

export const createRoom = async (inputName) => {
  const displayName = cleanDisplayName(inputName);
  const userId = randomUUID();

  const room = new Room({
    code: generateRoomCode(),
    hostUserId: userId,
    members: [
      {
        userId,
        displayName,
        isReady: true,
        connected: true
      }
    ]
  });

  try {
    await room.save();
  } catch (error) {
    if (error.code === 11000) {
      throw createError(
        "Room code collision. Please try creating the room again.",
        503
      );
    }

    throw error;
  }

  return { room, userId };
};

export const joinRoom = async (inputCode, inputName, existingUserId) => {
  if (typeof inputCode !== "string") {
    throw createError("Room code is required", 400);
  }

  const code = inputCode.trim().toUpperCase();

  if (!/^[A-Z0-9]{6}$/.test(code)) {
    throw createError("Room code must contain 6 letters or numbers", 400);
  }

  const displayName = cleanDisplayName(inputName);

  if (
    existingUserId !== undefined &&
    (typeof existingUserId !== "string" ||
      existingUserId.length < 1 ||
      existingUserId.length > 100)
  ) {
    throw createError("Invalid user ID", 400);
  }

  const room = await Room.findOne({ code });

  if (!room) {
    throw createError("Room not found", 404);
  }

  if (room.status !== "waiting") {
    throw createError("This room is no longer accepting players", 409);
  }

  const existingMember = existingUserId
    ? room.members.find((member) => member.userId === existingUserId)
    : null;

  if (existingMember) {
    existingMember.connected = true;
    await room.save();

    return { room, userId: existingMember.userId };
  }

  if (room.members.length >= room.settings.maxPlayers) {
    throw createError("This room is full", 409);
  }

  const userId = randomUUID();

  room.members.push({
    userId,
    displayName,
    isReady: false,
    connected: true
  });

  await room.save();

  return { room, userId };
};

export const getRoomById = async (roomId) => {
  if (!/^[a-f\d]{24}$/i.test(roomId)) {
    throw createError("Invalid room ID", 400);
  }

  const room = await Room.findById(roomId);

  if (!room) {
    throw createError("Room not found", 404);
  }

  return room;
};

export const toPublicRoom = (room) => ({
  id: room._id,
  code: room.code,
  hostUserId: room.hostUserId,
  members: room.members.map((member) => ({
    userId: member.userId,
    displayName: member.displayName,
    joinedAt: member.joinedAt,
    isReady: member.isReady,
    connected: member.connected
  })),
  settings: room.settings,
  status: room.status,
  activeGameId: room.activeGameId,
  createdAt: room.createdAt
});
