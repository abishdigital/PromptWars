const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EducationalResource',
      required: true,
    },
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
