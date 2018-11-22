export class Post {
  public id: number;
  public userId: string;
  public title: string;
  public imageUrl: string;
  public tags: string;
  public uploadTime: string;
  public author: string;
  public subscribers: string;
  public width: string;
  public height: string

  constructor(
    id: number,
    userId: string,
    title: string,
    imageUrl: string,
    tags: string,
    uploadTime: string,
    author: string,
    subscribers: string,
    width: string,
    height: string
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.imageUrl = imageUrl;
    this.tags = tags;
    this.uploadTime = uploadTime;
    this.author = author;
    this.subscribers = subscribers;
    this.width = width;
    this.height = height;
  }
}
