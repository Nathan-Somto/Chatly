import { Request, Response, NextFunction } from "express";
import { AccessToken } from "livekit-server-sdk";

const createToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, chatId, username } = req.body;
    const at = new AccessToken(
      process.env.LIVE_KIT_API_KEY,
      process.env.LIVE_KIT_API_SECRET,
      {
        identity: userId,
        ttl: "15m",
        name: username,
      }
    );
    at.addGrant({
      roomAdmin: true,
      roomJoin: true,
      room: chatId,
    });
    const token = await at.toJwt();
    return res.status(200).json({
      livekitToken: token,
      success: true,
      message: "Live Token created successfully",
    });
  } catch (err) {
    next(err);
  }
};
export const livekitService = {
    createToken,
    };
