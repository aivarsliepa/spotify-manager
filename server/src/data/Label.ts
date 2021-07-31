import { Document, Schema } from "mongoose";

interface LabelData {
  name: string;
}

export type LabelDocument = LabelData & Document;

export const labelSchema = new Schema<LabelDocument>({
  name: { required: true, type: String, unique: true },
});
