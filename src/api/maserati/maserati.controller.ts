import { Request, Response, NextFunction } from "express";
import mysql from "mysql2";
import { Modello } from "../../models/modello.model";

// === DATABASE CONNECTION ===
const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "MaseratiDB",
});

export const allModels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    conn.query("SELECT * FROM TModelli", (err, results: Modello[]) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }

      if (!results || results.length === 0) {
        res.status(404).json({ errore: "Nessun modello trovato" });
        return;
      }

      res.status(200).json(results);
    });
  } catch (err) {
    next(err);
  }
};

export const models = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ModelloID } = req.query;

  if (!ModelloID) {
    res.status(400).json({ errore: "Parametro ModelloID mancante" });
    return;
  }

  try {
    conn.query(
      "SELECT * FROM TModelli WHERE ModelloID = ?",
      [ModelloID],
      (err, results: Modello[]) => {
        if (err) {
          res.status(500).json({ error: err });
          return;
        }

        if (!results || results.length === 0) {
          res.status(404).json({ errore: "Nessun modello trovato" });
          return;
        }

        res.status(200).json(results);
      }
    );
  } catch (err) {
    next(err);
  }
};

export const DefaultModel = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ModelloID } = req.query;

  try {
    if (!ModelloID) {
      res.status(400).json({ errore: "Parametro ModelloID mancante" });
      return;
    }

    const sql = `
    SELECT 
      m.ModelloID,
      m.Nome AS NomeModello,
      c.CategoriaOptionalID,
      c.Nome AS NomeCategoria,
      o.OptionalID,
      o.Nome AS NomeOptional,
      o.Prezzo,
      o.FileImage,
      o.Predefinito
    FROM TModelli m
    JOIN TOptional o ON m.ModelloID = o.ModelloID
    JOIN TCategorieOptional c ON o.CategoriaOptionalID = c.CategoriaOptionalID
    WHERE m.ModelloID = ? AND Predefinito = 1;
  `;

    conn.query(sql, [ModelloID], (err, results) => {
      if (err) {
        console.error("Errore query:", err);
        res.status(500).json({ error: "Errore interno del server" });
        return;
      }

      if (!results || results === null) {
        res
          .status(404)
          .json({ errore: "Nessun optional trovato per questo modello" });
        return;
      }

      res.status(200).json(results);
    });
  } catch (err) {
    res.status(404).json({ errore: err });
  }
};

export const GetOptionalByModello = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ModelloID } = req.query;

  if (!ModelloID) {
    res.status(400).json({ errore: "Parametro ModelloID mancante" });
  }

  try {
    const sql = `
    SELECT 
      m.ModelloID,
      m.Nome AS NomeModello,
      c.CategoriaOptionalID,
      c.Nome AS NomeCategoria,
      o.OptionalID,
      o.Nome AS NomeOptional,
      o.Prezzo,
      o.FileImage,
      o.Predefinito
    FROM TModelli m
    JOIN TOptional o ON m.ModelloID = o.ModelloID
    JOIN TCategorieOptional c ON o.CategoriaOptionalID = c.CategoriaOptionalID
    WHERE m.ModelloID = ?;
`;

    conn.query(sql, [ModelloID], (err, results) => {
      if (err) {
        console.error("Errore query:", err);
        res.status(500).json({ error: "Errore interno del server" });
        return;
      }

      if (!results || results === null) {
        res
          .status(404)
          .json({ errore: "Nessun optional trovato per questo modello" });
        return;
      }

      res.status(200).json(results);
    });
  } catch (err) {
    res.status(404).json({ errore: err });
  }
};
