export function secondsToMinutes(seconds: number): { minutes: number; remainingSeconds: number } {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return { minutes, remainingSeconds };
}

export const BLUR_IMAGE_PATH =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==';

export function serialize(data: any) {
  return JSON.stringify(data);
}

export function deSerialize(data: any) {
  return JSON.parse(data);
}
