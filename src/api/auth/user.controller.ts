import { Request, Response, NextFunction } from "express";
import { createConnection } from "../connection";
import bcrypt from "bcrypt";
import { TypedRequest } from "../../lib/typed-request.interface";
import { UserDTO } from "./user.dto";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../lib/auth/jwt/jwt-strategy";

const SECRET_KEY = "MaseratiKey!123";

const { v4: uuidv4 } = require("uuid");

export const me = async (req: Request, res: Response, next: NextFunction) => {
  res.json(req.user);
};

export const registerMethod = async (
  req: TypedRequest<UserDTO>,
  res: Response,
  next: NextFunction
) => {
  const { username, password, avatar } = req.body;

  const conn = await createConnection();

  if (!username || !password || !avatar) {
    res.status(401).json({ error: "Inserire tutti i parametri" });
  }

  const [users] = await conn.query("SELECT * FROM user WHERE Username = ?", [
    username,
  ]);
  if ((users as any[]).length > 0) {
    res.status(409).json({
      success: false,
      message: "Username già esistente",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const id = uuidv4();

  await conn.query(
    "INSERT INTO user (userID, username, password, avatar) values (?,?,?,?)",
    [id, username, password, avatar]
  );

  res.status(201).json({
    success: true,
    message: "Utente creato con successo",
  });
};

export const loginMethod = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401).json({ error: "Inserire tutti i parametri" });
  }

  const conn = await createConnection();

  try {
    const [users] = await conn.query("SELECT * FROM user WHERE username = ?", [
      username,
    ]);

    if ((users as any[]).length < 0) {
      res.status(401).json({
        error: "Utente non trovato",
      });
    }

    const user = (users as any[])[0];

    const matchedPassword = bcrypt.compare(password, user.Password);

    if (!matchedPassword) {
      res.status(401).json({ error: "Password errata" });
    }

    const payload = {
      Id: user.UserId,
      Username: user.Username,
      Avatar: user.Avatar,
      PriceListId: user.PriceListId,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30m" });

    res.status(200).json({
      success: true,
      message: "Login riuscito",
      user: {
        Username: user.Username,
        Token: token,
      },
    });
  } catch (err: any) {
    res.json({ error: err });
  }
};
