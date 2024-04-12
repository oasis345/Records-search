import { List } from '@/app/components/list/List';
import MatchResult from '../components/match/MatchResult';

export class Match {
  id: string;
  creationTime: number;
  durationTime: number;
  mode?: string;
  isWin?: boolean;
  ranking?: number;
  participants: Participant[] | string[];
  data: any = {};

  constructor(match: Match) {
    this.data = match.data;
    this.id = match.id;
    this.creationTime = match.creationTime;
    this.durationTime = match.durationTime;
    this.mode = match?.mode;
    this.isWin = match?.isWin;
    this.ranking = match.ranking;
    this.participants = match.participants || [];
  }
}

interface Participant {
  name: string;
  icon?: string;
}

export abstract class MatchHistoryItemBuilder<T extends Match = any> {
  constructor(public resource: any) {}

  protected getHeader(match: T) {
    return <MatchResult match={match} />;
  }

  protected getSubContent(match: T) {
    if (!match.participants) return;

    return (
      <List
        items={match.participants}
        keyField="name"
        classes="hidden grid-cols-2 lg:grid md:grid"
        itemClasses="flex w-28 text-xs"
      />
    );
  }

  abstract getContents(data: any): React.ReactNode;
  protected getDetail?(data: any): React.ReactNode;
  protected getClasses?(): string;

  build(match: T) {
    const matchHistoryItem = {
      item: match,
      itemKey: match?.id,
      header: this.getHeader(match),
      content: this.getContents?.(match.data),
      subContent: this.getSubContent(match),
      detail: this.getDetail?.(match.data),
      classes: this.getClasses?.(),
    };

    return matchHistoryItem;
  }
}
