import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface INote extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  visibility: 'private' | 'shared' | 'public';
  author: Types.ObjectId;
  sharedWith: Types.ObjectId[];
  publicToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthRequest extends Request {
  user?: IUser;
}