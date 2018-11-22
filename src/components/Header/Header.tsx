import * as React from "react";
import "../Header/Header.css";
import * as firebase from "firebase";

interface IProps {
  updateAuthenticatedState: any;
  updateIsHomePageSelected: any;
  onOpenModal: any;
  searchByTag: any;
}

// tslint:disable-next-line:no-var-requires

export default class Header extends React.Component<IProps> {
  constructor(props: any) {
    super(props);

    this.btnClicked = this.btnClicked.bind(this);
    this.selectHome = this.selectHome.bind(this);
    this.selectProfile = this.selectProfile.bind(this);
    this.onSearchByTag = this.onSearchByTag.bind(this);
    this.searchByVoice = this.searchByVoice.bind(this);
    this.postAudio = this.postAudio.bind(this);
  }
  public render() {
    return (
      <nav className="navbar navbar-expand-md bg-dark navbar-dark sticky-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <a href="#" className="navbar-brand">
              Bike Forever
            </a>
          </div>
          <div className="navbar-collapse collapse">
            {/* Search bar */}
            <form className="form-inline ml-auto ml-6">
              <button
                className="btn btn-dark mr-sm-1"
                type="submit"
                onClick={this.searchByVoice}
              >
                <i className="fas fa-microphone" />
              </button>
              <input
                className="form-control mr-sm-1"
                id="search-tag-textbox"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                className="btn btn-dark my-2 my-sm-0"
                type="submit"
                onClick={this.onSearchByTag}
              >
                <i className="fa fa-search" />
              </button>
            </form>
            {/* button group */}
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <button
                  className="btn btn-dark"
                  onClick={this.props.onOpenModal}
                >
                  <i className="fas fa-plus" />
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-dark" onClick={this.selectHome}>
                  <i className="fas fa-home" />
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-dark profile"
                  onClick={this.selectProfile}
                >
                  <i className="far fa-user" />
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-primary"
                  onClick={this.btnClicked}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  private btnClicked() {
    firebase.auth().signOut();
    this.props.updateAuthenticatedState(false);
  }

  private selectHome() {
    this.props.updateIsHomePageSelected(true);
  }

  private selectProfile() {
    this.props.updateIsHomePageSelected(false);
  }

  // Search post by tag
  private onSearchByTag() {
    const textBox = document.getElementById(
      "search-tag-textbox"
    ) as HTMLInputElement;
    if (textBox === null) {
      return;
    }
    const tag = textBox.value;
    console.log("In header: " + tag);
    this.props.searchByTag(tag);
  }

  private searchByVoice() {
    let accessToken: any;
    fetch(
      "https://southeastasia.api.cognitive.microsoft.com/sts/v1.0/issuetoken",
      {
        headers: {
          "Content-Length": "0",
          "Content-Type": "application/x-www-form-urlencoded",
          "Ocp-Apim-Subscription-Key": "a1093da47c454391bfdee804be967f10"
        },
        method: "POST"
      }
    )
      .then(response => {
        return response.text();
      })
      .then(response => {
        console.log("Response: " + response);
        accessToken = response;
      })
      .catch(error => {
        console.log("Error", error);
      });

    const MediaStreamRecorder = require("msr");
    const mediaConstraints = {
      audio: true
    };
    const onMediaSuccess = (stream: any) => {
      const mediaRecorder = new MediaStreamRecorder(stream);
      mediaRecorder.mimeType = "audio/wav"; // check this line for audio/wav
      mediaRecorder.ondataavailable = (blob: any) => {
        this.postAudio(blob, accessToken);
        setTimeout(() => {
          mediaRecorder.stop();
        }, 6000)
      };
      mediaRecorder.start();
    };

    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

    function onMediaError(e: any) {
      console.error("media error", e);
    }
  }

  // Post Audio to get text
  private postAudio(blob: any, accessToken: any) {
    console.log("Accesstoken: " + accessToken);
    // posting audio
    fetch(
      "https://southeastasia.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US",
      {
        body: blob,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer" + accessToken,
          "Content-Type": "audio/wav;codec=audio/pcm; samplerate=16000",
          "Ocp-Apim-Subscription-Key": "a1093da47c454391bfdee804be967f10"
        },
        method: "POST"
      }
    )
      .then(res => {
        return res.json();
      })
      .then((res: any) => {
        console.log(res);
        const textBox = document.getElementById(
          "search-tag-textbox"
        ) as HTMLInputElement;
        textBox.value = (res.DisplayText as string).slice(0, -1);
      })
      .catch(error => {
        console.log("Error", error);
      });
  }
}
