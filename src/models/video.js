import { Schema, model } from 'mongoose';

const pointSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

const stepSchema = new Schema(
  {
    beginTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    points: [pointSchema],
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
    steps: [stepSchema],
  },
  { versionKey: false }
);

const Video = model('Video', schema);

export default Video;
