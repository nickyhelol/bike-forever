import * as React from "react";
import "../Profile/Profile.css";
import { Post } from "src/Post";
import EditPostModal from "../EditPostModal/EditPostModal";

interface IProps {
  currentUser: any;
  posts: Post[];
}

interface IState {
  selectedPost: Post;
  openEdit: boolean;
}
export default class Profile extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      selectedPost: this.props.posts[0],
      openEdit: false
    };

    this.deletePost = this.deletePost.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
  }
  public render() {
    return (
      <div>
        <h3 className="text-center">
          Welcome back {this.props.currentUser.displayName}!
        </h3>
        <div className="row">
          <div className="col-12">
            <div className="repo">{this.initializeView()}</div>
          </div>
        </div>
        <EditPostModal
          selectedPost={this.state.selectedPost}
          open={this.state.openEdit}
          onCloseModal={this.closeEditModal}
        />
      </div>
    );
  }

  private openEditModal(post: Post) {
    this.setState({
      openEdit: true,
      selectedPost: post
    });
  }

  private closeEditModal() {
    this.setState({
      openEdit: false
    });
  }

  // Initialize views
  private initializeView() {
    const repo: Post[] = [];
    this.props.posts.map((post: Post) => {
      if (post.userId === this.props.currentUser.uid) {
        repo.push(post);
      }
    });

    return repo.map((post, index) => {
      return (
        <div key={index} className="row h-100 justify-content-center">
          <a
            href="#"
            className="list-group-item list-group-item-action flex-column align-items-start float-left col-5"
          >
            <div className="float-left">
              <div className="d-flex w-100 justify-content-betwee">
                <h5 className="mb-1">{post.title}</h5>
              </div>
              <div className="d-flex w-100 justify-content-betwee">
                <p className="mb-1">{post.tags}</p>
              </div>
            </div>
            <span className="float-right col-3">
              <img
                alt="Image"
                className="img-responsive post-item-image"
                src={post.imageUrl}
              />
            </span>
          </a>
          <div className="float-right">
            <button
              className="btn btn-warning eidt"
              onClick={this.openEditModal.bind(this, post)}
            >
              Edit
            </button>
            <button className="btn btn-danger" onClick={this.deletePost.bind(this, post)}>
              Delete
            </button>
          </div>
        </div>
      );
    });
  }

  // Delete post
  private deletePost(post: Post) {
    const check = confirm("Are you sure to delete the post?");
    if (check === true) {
      const id = post.id;
      const url = "https://bikeforeverapi.azurewebsites.net/api/PostItems/" + id;
  
      fetch(url, {
        method: "DELETE"
      }).then((response: any) => {
        if (!response.ok) {
          // Error Response
          alert(response.statusText);
        } else {
          location.reload();
        }
      });
    }  
  }
}
