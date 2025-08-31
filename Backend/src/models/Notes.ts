import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  userId: string;
  text: string;
  createdAt: Date;
}

const NoteSchema = new Schema<INote>({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INote>("Note", NoteSchema);
