import * as React from "react";
import "../PostItem/PostItem.css";
import { Post } from "src/Post";

interface IProps {
  index: number;
  post: Post;
  selectedPost: any;
}

export default class PostItem extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <a
        href="#"
        className="list-group-item list-group-item-action flex-column align-items-start"
        onClick={this.props.selectedPost.bind(
          this,
          this.props.post,
          this.props.index
        )}
      >
        <div className="float-left">
          <div className="d-flex w-100 justify-content-betwee">
            <h5 className="mb-1">{this.props.post.title}</h5>
          </div>
          <div className="d-flex w-100 justify-content-betwee">
            <p className="mb-1">{this.props.post.tags}</p>
          </div>
        </div>
        <span className="float-right">
          <img
            alt="Image"
            className="img-responsive post-item-image"
            src={this.props.post.imageUrl}
          />
        </span>
      </a>
    );
  }
}
