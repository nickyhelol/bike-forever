import * as React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import PostList from "./components/PostList/PostList";
import PostDetail from "./components/PostDetail/PostDetail";
import { Post } from "./Post";
import Profile from "./components/Profile/Profile";
import * as firebase from "firebase/app";
import { StyledFirebaseAuth } from "react-firebaseui";
import UploadPostModal from "./components/UploadPostModal/UploadPostModal";
import bg from "../src/assets/dark.jpg";

const config = {
  apiKey: "AIzaSyCVjTulRiz0DvsDZf875VlwcMPRqmV-rmM",
  authDomain: "bike-forever.firebaseapp.com"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

interface IState {
  authenticated: boolean;
  isLoginPageOpen: boolean;
  selectedPost: Post;
  selectedIndex: number;
  isHomePageSelected: boolean;
  posts: Post[];
  searchResults: Post[];
  uploadTime: string;
  openUpload: boolean;
}

class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      authenticated: false,
      isLoginPageOpen: false,
      selectedPost: new Post(
        0,
        "8tixSDQ0UVO5bb4Uxl60WVyZCkJ3",
        "Yamaha r6",
        "https://ftecu.com/shop/images/54712/17_r6_blue_b1.jpeg",
        "Sport bike",
        "19/11/2018, 22:55:14",
        "Nick",
        "",
        "",
        ""
      ),
      selectedIndex: 0,
      isHomePageSelected: true,
      posts: [],
      searchResults: [],
      uploadTime: "",
      openUpload: false,
    };

    this.selectNewPost = this.selectNewPost.bind(this);
    this.updateSubscribeStatus = this.updateSubscribeStatus.bind(this);
    this.updateAuthenticatedState = this.updateAuthenticatedState.bind(this);
    this.updateIsHomePageSelected = this.updateIsHomePageSelected.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.searchByTag = this.searchByTag.bind(this);
    this.loadData();
  }

  public render() {
    let styles = {};

    if (!this.state.authenticated) {
      styles = {
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        overflow: "hidden",
        backgroundPosition: "center"
      };
    }

    return (
      <div className="App" style={styles}>
        {this.state.authenticated ? (
          <div>
            <Header
              updateAuthenticatedState={this.updateAuthenticatedState}
              updateIsHomePageSelected={this.updateIsHomePageSelected}
              onOpenModal={this.openModal}
              searchByTag={this.searchByTag}
            />
            {this.state.isHomePageSelected ? (
              <div className="container">
                <div className="row">
                  <div className="col-5">
                    <PostList
                      posts={this.state.posts}
                      selectNewPost={this.selectNewPost}
                    />
                  </div>
                  <div className="col-7">
                    <PostDetail
                      currentUser={firebase.auth().currentUser}
                      selectedPost={this.state.selectedPost}
                      updateSubscribeStatus={this.updateSubscribeStatus}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="container">
                <Profile
                  currentUser={firebase.auth().currentUser}
                  posts={this.state.posts}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="login-page">
            <h2 className="login-header">
              Can't wait to post your beloved bike?
            </h2>
            <h4 className="login-header">Please sign in first!</h4>
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </div>
        )}
        <UploadPostModal
          currentUser={firebase.auth().currentUser}
          open={this.state.openUpload}
          onCloseModal={this.closeModal}
        />
      </div>
    );
  }

  public componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        authenticated: !!user
      });
    });
  };

  // Open upload modal
  private openModal() {
    this.setState({
      openUpload: true
    });
  }

  // Close upload Modal
  private closeModal() {
    this.setState({
      openUpload: false
    });
  }

  // Update the state of isHomePageSelected
  private updateIsHomePageSelected(check: boolean) {
    this.setState({
      isHomePageSelected: check
    });
  }

  // Change selected meme
  private selectNewPost(newPost: Post, newIndex: number) {
    this.setState({
      selectedPost: newPost,
      selectedIndex: newIndex
    });
  }

  // Update subscribers state
  private updateSubscribeStatus(newPost: Post) {
    // const newPosts = [...this.state.posts];
    // newPosts[this.state.selectedIndex] = newPost;
    // this.setState({
    //   posts: newPosts
    // });
  }

  // Update authenticated state
  private updateAuthenticatedState(isAuthenticated: boolean) {
    console.log("before: " + isAuthenticated);
    this.setState(
      {
        authenticated: isAuthenticated
      },
      () => {
        console.log("after: " + this.state.authenticated);
      }
    );
  }

  // Initialize the database
  private loadData() {
    const url = "https://bikeforeverapi.azurewebsites.net/api/PostItems";

    fetch(url, {
      method: "GET"
    })
      .then(res => res.json())
      .then((json: Post[]) => {
        let currentPost: Post = json[0];
        if (currentPost === undefined) {
          currentPost = {
            id: 0,
            userId: "",
            title: "No posts",
            imageUrl: "",
            tags: "try a different tag",
            uploadTime: "",
            author: "",
            subscribers: "",
            width: "",
            height: ""
          };
        }
        this.setState({
          selectedPost: currentPost,
          posts: json
        });
      });
  }

  // Search by tag
  private searchByTag(tag: any) {
    const url = "https://bikeforeverapi.azurewebsites.net/api/PostItems";
    fetch(url, {
      method: "GET"
    })
      .then(res => res.json())
      .then((json: Post[]) => {
        const posts = json;
        let results: Post[] = [];
        if (tag !== "") {
          posts.forEach(p => {
            if (p.tags.includes(tag)) {
              results.push(p);
            }
          });
        } else {
          results = posts;
        }
        let currentPost = results[0];
        if (currentPost === undefined) {
          currentPost = {
            id: 0,
            userId: "",
            title: "No posts",
            imageUrl: "",
            tags: "try a different tag",
            uploadTime: "",
            author: "",
            subscribers: "",
            width: "",
            height: ""
          };
        }

        this.setState({
          selectedPost: currentPost,
          posts: results
        });
      });
  }

}

export default App;
