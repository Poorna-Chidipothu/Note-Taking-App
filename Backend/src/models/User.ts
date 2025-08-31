import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  dob: Date;              
  passwordHash?: string;  // if later we allow password-based login
  googleId?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: Date, required: false },  
  passwordHash: { type: String },
  googleId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", userSchema);
