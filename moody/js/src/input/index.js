import Video from './video';

const video = new Video();


export default async () => {
  return {
    video: await video.getData()
  };
};
