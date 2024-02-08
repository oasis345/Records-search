import dayjs from './dayjs';

export function secondsToMinutes(seconds: number): { minutes: number; remainingSeconds: number } {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return { minutes, remainingSeconds };
}

export function getRelativeTime(timestamp: string): string {
  const currentTime: dayjs.Dayjs = dayjs.utc();
  const targetTime: dayjs.Dayjs = dayjs.utc(timestamp);

  // Calculate the duration between the current time and the target time
  const duration = dayjs.duration(currentTime.diff(targetTime));

  // Check the duration and return the appropriate relative time
  if (duration.asSeconds() < 60) {
    const seconds = Math.floor(duration.asSeconds());
    return `최근 업데이트: ${seconds}초 전`;
  } else if (duration.asMinutes() < 60) {
    const minutes = Math.floor(duration.asMinutes());
    return `최근 업데이트: ${minutes}분 전`;
  } else if (duration.asHours() < 24) {
    const hours = Math.floor(duration.asHours());
    return `최근 업데이트: ${hours}시간 전`;
  } else {
    const days = Math.floor(duration.asDays());
    return `최근 업데이트: ${days}일 전`;
  }
}

export const BLUR_IMAGE_PATH =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==';
