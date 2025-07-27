import mongoose, { Schema } from 'mongoose';
import { INote } from '../types';
import crypto from 'crypto';

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  visibility: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  publicToken: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Generate public token for public notes
noteSchema.pre('save', function(next) {
  if (this.visibility === 'public' && !this.publicToken) {
    this.publicToken = crypto.randomBytes(32).toString('hex');
  } else if (this.visibility !== 'public') {
    this.publicToken = undefined;
  }
  next();
});

// Index for search
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });
noteSchema.index({ author: 1, visibility: 1 });

export const Note = mongoose.model<INote>('Note', noteSchema);