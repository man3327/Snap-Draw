import {
  createRoom as createRoomService,
  joinRoom as joinRoomService,
  getRoomById,
  toPublicRoom
} from "../services/room.service.js";

export const createRoom = async (req, res, next) => {
  try {
    const { displayName } = req.body ?? {};
    const { room, userId } = await createRoomService(displayName);

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      userId,
      room: toPublicRoom(room)
    });
  } catch (error) {
    next(error);
  }
};

export const joinRoom = async (req, res, next) => {
  try {
    const { code, displayName, userId } = req.body ?? {};

    const result = await joinRoomService(
      code,
      displayName,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Joined room successfully",
      userId: result.userId,
      room: toPublicRoom(result.room)
    });
  } catch (error) {
    next(error);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await getRoomById(req.params.roomId);

    res.status(200).json({
      success: true,
      room: toPublicRoom(room)
    });
  } catch (error) {
    next(error);
  }
};
