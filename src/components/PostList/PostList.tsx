import * as React from "react";
import PostItem from "./PostItem/PostItem";
import "../PostList/PostList.css";
import { Post } from 'src/Post';

interface IProps {
  posts: Post[];
  selectNewPost: any;
}

export default class PostList extends React.Component<IProps, {}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="row">
        <div className="col-12">
          <h2 className="post-list-heading">Post your bike here!</h2>
          <div className="list-group">{this.initializeList()}</div>
        </div>
      </div>
    );
  }

  // Initialize the post list
  public initializeList() {
    console.log("In post list: "+this.props.posts)
    return this.props.posts.map((post, index) => {
      return <PostItem post={post} key={post.imageUrl} index={index} selectedPost={this.props.selectNewPost}/>;
    });
  }
}
