import * as React from "react";
import Modal from "react-responsive-modal";
import { Post } from 'src/Post';

interface IProps {
  selectedPost: Post;
  open: boolean;
  onCloseModal: any;
}

export default class EditPostModal extends React.Component<IProps> {
  constructor(props: any) {
    super(props);

    this.updatePost = this.updatePost.bind(this);
  }

  public render() {
    return (
      <Modal open={this.props.open} onClose={this.props.onCloseModal}>
        <form>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              id="edit-title-input"
              placeholder="Enter Title"
            />
            <small className="form-text text-muted">
              You can edit any post later
            </small>
          </div>
          <div className="form-group">
            <label>Tag</label>
            <input
              type="text"
              className="form-control"
              id="edit-tag-input"
              placeholder="Enter Tag"
            />
            <small className="form-text text-muted">
              Tag is used for search
            </small>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.updatePost}
          >
            Save
          </button>
        </form>
      </Modal>
    );
  }

  // Update post detail
  private updatePost() {
    const titleInput = document.getElementById(
      "edit-title-input"
    ) as HTMLInputElement;
    const tagInput = document.getElementById(
      "edit-tag-input"
    ) as HTMLInputElement;

    if (titleInput === null || tagInput === null) {
      return;
    }

    const selectedPost = this.props.selectedPost;
    const url =
      "https://bikeforeverapi.azurewebsites.net/api/PostItems/" + selectedPost.id;
    const updatedTitle = titleInput.value;
    const updatedTag = tagInput.value;
    fetch(url, {
      body: JSON.stringify({    
        id: selectedPost.id,
        userId: selectedPost.userId,
        title: updatedTitle,
        imageUrl: selectedPost.imageUrl,
        tags: updatedTag,
        uploadTime: selectedPost.uploadTime,
        author: selectedPost.author,
        subscribers: selectedPost.subscribers,
        width: selectedPost.width,
        height: selectedPost.height,
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
