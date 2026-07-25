const mongoose = require('mongoose');

const EducationalResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: [
        'Coping Mechanisms',
        'Relapse Prevention',
        'Mindfulness',
        'Neuroscience of Recovery',
        'Support Systems',
      ],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    readTime: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

EducationalResourceSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('EducationalResource', EducationalResourceSchema);
