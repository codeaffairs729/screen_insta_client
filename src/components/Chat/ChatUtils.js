import isAudio from 'is-audio';
import isVideo from 'is-video';
import isFile from 'is-file';
import isImage from 'is-image';

export function getFileType(fileName) {
  if (isVideo(fileName)) return 'video';
  if (isAudio(fileName)) return 'audio';
  if (isImage(fileName)) return 'photo'; // adatped to react-chat-elements MessageBox 
  if (isFile(fileName)) return 'file';
  return 'unknown';
}