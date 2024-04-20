export class User {
  id: string;
  profileIcon?: string;
  region: string;
  name: string;
  tag?: string;
  data: any;

  constructor(user: User) {
    this.id = user.id;
    this.profileIcon = user.profileIcon;
    this.region = user.region;
    this.name = user.name;
    this.tag = user.tag;
    this.data = user.data;
  }
}
