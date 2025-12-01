import { Request, Response, NextFunction } from "express";
import mysql from "mysql2";
import { Modello, OptionalsModello } from "../../models/modello.model";
import * as XLSX from "xlsx";
import path from "path";
import { Next } from "mysql2/typings/mysql/lib/parsers/typeCast";
import { execFile } from "child_process";
import multer from "multer";
import fs from "fs";

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

export const CreateFileConfiguration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const info = req.body as OptionalsModello[];

    if (!Array.isArray(info)) {
      res.status(400).json({
        errore: "Il body deve contenere un OptionalsModello",
      });
    }

    for (const modello of info)
      if (
        typeof modello.ModelloID !== "number" ||
        typeof modello.NomeModello !== "string" ||
        typeof modello.NomeCategoria !== "string" ||
        typeof modello.OptionalID !== "number" ||
        typeof modello.NomeOptional !== "string" ||
        typeof modello.Prezzo !== "number"
      ) {
        res.status(400).json({
          errore: "Struttura Modello non valida",
          modelloRicevuto: info,
        });
      }

    const worksheet = XLSX.utils.json_to_sheet(info);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dati");

    const fileName = `configurazione_${Date.now()}.xlsx`;

    const filePath = path.join(__dirname, "../../files", fileName); //__dirname variabile globale contiene il percorso assoluto della cartella in cui si trova il file corrente

    XLSX.writeFile(workbook, filePath);

    res.status(200).json({
      messaggio: "File Excel creato con successo",
      file: fileName,
      path: filePath,
    });
  } catch (error) {
    console.error("Errore creazione file:", error);
    res.status(500).json({
      errore: "Errore durante la creazione del file Excel",
    });
  }
};

export const ReadFileConfiguration = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    res.status(400).json({ error: "File non ricevuto" });
    return;
  }

  const filePath = req.file.path;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    fs.unlinkSync(filePath); // cancella file temporaneo

    res.status(200).json({
      messaggio: "File letto correttamente",
      data,
    });
  } catch (err) {
    res.status(500).json({ error: "Errore lettura file" });
  }
};
