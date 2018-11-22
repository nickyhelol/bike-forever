import * as React from "react";
import Modal from "react-responsive-modal";

interface IProps {
  currentUser: any;
  open: boolean;
  onCloseModal: any;
}

interface IState {
  uploadImage: any;
}
export default class UploadPostModal extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.uploadPost = this.uploadPost.bind(this);
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
              id="title-input"
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
              id="tag-input"
              placeholder="Enter Tag"
            />
            <small className="form-text text-muted">
              Tag is used for search
            </small>
          </div>
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              onChange={this.handleImageUpload}
              className="form-control-file"
              id="image-input"
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.uploadPost}
          >
            Upload
          </button>
        </form>
      </Modal>
    );
  }

  private handleImageUpload(images: any) {
    this.setState({
      uploadImage: images.target.files
    });
  }

  // Upload new post
  private uploadPost() {
    const titleInput = document.getElementById(
      "title-input"
    ) as HTMLInputElement;
    const tagInput = document.getElementById("tag-input") as HTMLInputElement;
    const imageFile = this.state.uploadImage[0];

    if (titleInput === null || tagInput === null || imageFile === null) {
      return;
    }

    const userId = this.props.currentUser.uid;
    const author = this.props.currentUser.displayName;
    const title = titleInput.value;
    const tags = tagInput.value;
    const subscribers = "";
    const url = "https://bikeforeverapi.azurewebsites.net/api/PostItems/upload";

    const formData = new FormData();
    formData.append("UserId", userId);
    formData.append("Title", title);
    formData.append("Image", imageFile);
    formData.append("Tags", tags);
    formData.append("Author", author);
    formData.append("Subscribers", subscribers);

    fetch(url, {
      body: formData,
      headers: {
        "cache-control": "no-cache"
      },
      method: "POST"
    }).then((response: any) => {
      if (!response.ok) {
        // Error State
        alert(response.statusText);
      } else {
        location.reload();
      }
    });
  }
}
