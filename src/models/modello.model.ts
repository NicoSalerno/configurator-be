import { RowDataPacket } from "mysql2";

export interface Modello extends RowDataPacket {
  ModelloID: number;
  Nome: string;
  PrezzoBase: number;
  FileImageSfondo: string
}