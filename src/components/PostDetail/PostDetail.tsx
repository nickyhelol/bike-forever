import * as React from "react";
import { Post } from "src/Post";
import "../PostDetail/PostDetail.css";

interface IProps {
  currentUser: any;
  selectedPost: Post;
  updateSubscribeStatus: any;
}

interface IState {
  isSubscribed: boolean;
  classes: string;
  numOfSubscribers: number;
}
export default class PostDetail extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.didSubscribe = this.didSubscribe.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
  }

  public render() {
    this.initializeView();

    return (
      <div className="row post-detail">
        <h4>Author: {this.props.selectedPost.author}</h4>
        <img
          className="post-detail-image"
          src={this.props.selectedPost.imageUrl}
        />
        <b className="left">{this.props.selectedPost.title}</b>
        <span className="right">{this.props.selectedPost.uploadTime}</span>
        <p className="tags">Tags: {this.props.selectedPost.tags}</p>
        <div className="btn-group thumb">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={this.didSubscribe}
          >
            <i className={this.state.classes} />
          </button>
          <button type="button" className="btn btn-outline-primary">
            {this.state.numOfSubscribers}
          </button>
        </div>
      </div>
    );
  }

  // Initialize view based on specific values
  private initializeView() {
    let check = false;
    let defaultClasses = "far fa-thumbs-up";
    let num = 0;

    if (this.props.selectedPost.subscribers !== null) {
      const subscribers = this.props.selectedPost.subscribers.slice();
      const arr = subscribers.split(",");
      arr.forEach(s => {
        if (s === this.props.currentUser.uid) {
          check = true;
          defaultClasses = "fas fa-thumbs-up";
        }
      });
      num = arr.length;
    }

    this.state = {
      isSubscribed: check,
      classes: defaultClasses,
      numOfSubscribers: num
    };
  }

  private didSubscribe() {
    let newSubscribers = "";
    if (this.state.isSubscribed) {
      const currentSubscribers = this.props.selectedPost.subscribers.slice();
      const arr = currentSubscribers.split(",");
      const index = arr.indexOf(this.props.currentUser.uid);
      if (index > -1) {
        arr.splice(index, 1);
      }

      if (arr !== null) {
        newSubscribers = arr[0];
        for (let i = 1; i < arr.length - 1; i++) {
          newSubscribers = newSubscribers.concat("," + arr[i]);
        }
      }
    } else {
      if (this.props.selectedPost.subscribers === null) {
        newSubscribers = this.props.currentUser.uid;
      } else {
        newSubscribers = this.props.selectedPost.subscribers.slice();
        newSubscribers = newSubscribers.concat(
          "," + this.props.currentUser.uid
        );
      }
    }

    this.updateSubscribers(newSubscribers);
  }

  // Update post subscribers
  private updateSubscribers(newSubscribers: string) {
    const selectedPost = this.props.selectedPost;
    const url =
      "https://bikeforeverapi.azurewebsites.net/api/PostItems/" +
      selectedPost.id;

    fetch(url, {
      body: JSON.stringify({
        id: selectedPost.id,
        userId: selectedPost.userId,
        title: selectedPost.title,
        imageUrl: selectedPost.imageUrl,
        tags: selectedPost.tags,
        uploadTime: selectedPost.uploadTime,
        author: selectedPost.author,
        subscribers: newSubscribers,
        width: selectedPost.width,
        height: selectedPost.height
      }),
      headers: {
        "Content-Type": "application/json",
        "cache-control": "no-cache"
      },
      method: "PUT"
    }).then((response: any) => {
      if (!response.ok) {
        // Error State
        alert(response.statusText + " " + url);
      } else {
        location.reload();
      }
    });
  }
}
