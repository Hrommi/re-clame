import Video from '../../models/video'

export async function get(req, res) {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch(error) {
    res.status(500);
    res.json({
      message: 'Something went wrong.'
    });
  }
}

export async function post(req, res) {
  try {
    const { data } = req.body;
    const video = new Video(data);
    await video.save();
    res.status(201);
    res.end();
  } catch(error) {
    res.status(500);
    res.json({
      message: 'Something went wrong.'
    });
  }
}
