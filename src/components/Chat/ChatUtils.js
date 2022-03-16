import isAudio from 'is-audio';
import isVideo from 'is-video';
import isFile from 'is-file';
import isImage from 'is-image';

import videoExtensions from 'video-extensions';
import audioExtensions from 'audio-extensions';
import imageExtensions from 'image-extensions';
import FileType from 'file-type/browser';

export function getFileType2(fileName) {
  if (isVideo(fileName)) return 'video';
  if (isAudio(fileName)) return 'audio';
  if (isImage(fileName)) return 'photo'; // adatped to react-chat-elements MessageBox 
  if (isFile(fileName)) return 'file';
  return 'unknown';
}



export const getFileType = async (file) => {

  const value = await FileType.fromBlob(file);
  if (!value) return { ext: "unknown", type: "unknown" };
  const { ext } = value;

  if (videoExtensions.indexOf(ext) !== -1) return { ext, type: 'video' };
  if (audioExtensions.indexOf(ext) !== -1) return { ext, type: 'audio' };
  if (imageExtensions.indexOf(ext) !== -1) return { ext, type: 'image' };
  return { ext, type: 'file' };


}




