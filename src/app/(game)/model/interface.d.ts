interface MatchResult {
  creationTime: number;
  durationTime: number;
  mode: string;
  isWin?: boolean;
  ranking?: number;
}

interface Participant {
  name: string;
}
