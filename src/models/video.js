import { Schema, model } from 'mongoose';

const pointsSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

const stepsSchema = new Schema(
  {
    time: { type: Number, required: true },
    points: [pointsSchema],
  },
  {
    _id: false,
  }
);

const schema = new Schema(
  {
    size: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    url: { type: String, required: true },
    steps: [stepsSchema],
  },
  { versionKey: false }
);

const Video = model('Video', schema);

export default Video;
