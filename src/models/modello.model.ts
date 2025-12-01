import { RowDataPacket } from "mysql2";

export interface Modello extends RowDataPacket {
  ModelloID: number;
  Nome: string;
  PrezzoBase: number;
  FileImageSfondo: string
}

export interface OptionalsModello extends RowDataPacket {
  ModelloID: number,
  NomeModello: string,
  NomeCategoria: string,
  OptionalID: number,
  NomeOptional: string,
  Prezzo: number,
}