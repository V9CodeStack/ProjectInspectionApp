import Button from "@mui/material/Button";
import NavBar from "../NavBar/navIndex";
import DelayedText from "../DelayedText/DelayedText";
import { Component } from "react";
import Cookies from "js-cookie";
import DownloadPdf from "../DownloadPdf/index.js";
import CopyToClipboardButton from "../CopyToClipboardButton";
import Loader from "react-loader-spinner";
import RenderCards from "../RenderCards/rendercards";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./managerIndex.css";

class Manager extends Component {
  state = {
    inputValue: "",
    groupName: "",
    groupID: "",
    displayFlag: false,
    loader: false,
    createGroupFlag: true,
  };

  componentDidMount() {
    const groupNameCookie = Cookies.get("group_name");
    const groupIdCookie = Cookies.get("manager_group_id");
    if (groupIdCookie !== undefined) {
      this.setState({
        displayFlag: true,
        groupID: groupIdCookie,
        groupName: groupNameCookie,
      });
    }
  }

  onChangeInput = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  //Create Group Name
  createGroupName = async () => {
    const { inputValue } = this.state;
    if (inputValue.length > 0) {
      this.setState({
        loader: true,
        createGroupFlag: false,
      });
      const url =
        "https://projectinspection.netlify.app/.netlify/functions/api/group";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: inputValue }),
      };

      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        Cookies.set("group_name", data.name, { expires: 1 });
        Cookies.set("manager_group_id", data._id, { expires: 1 });
        this.setState(
          {
            groupID: data._id,
            groupName: data.name,
            displayFlag: true,
            loader: false,
            inputValue: "",
          },
          this.resetGroupCreated()
        );
      }
    }
  };

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="Oval" color="white" height="18" width="18" />
    </div>
  );

  renderGroupCreated = () => {
    const { loader } = this.state;
    return <>{loader ? this.renderLoadingView() : "Group Created"}</>;
  };

  resetGroupCreated = () => {
    setTimeout(() => this.setState({ createGroupFlag: true }), 5000);
  };

  render() {
    const {
      inputValue,
      groupName,
      groupID,
      displayFlag,
      loader,
      createGroupFlag,
    } = this.state;

    return (
      <>
        <NavBar groupName={groupName} />
        <div className="manager-container">
          <div className="input-groupid-container">
            <div className="input-container">
              <input
                type="text"
                className="input"
                value={inputValue}
                placeholder="Enter Group Name"
                onChange={this.onChangeInput}
              />
              <button
                type="button"
                style={{ width: "145px", height: "30px" }}
                className="button"
                onClick={this.createGroupName}
              >
                {createGroupFlag
                  ? "Create New Group"
                  : this.renderGroupCreated()}
              </button>
            </div>
            {displayFlag ? (
              <div className="groupname-downloadpdf-container">
                <div className="goupid-container">
                  <div className="group-id-container">
                    <div className="group-id-card">
                      <p className="group-id-text">{groupID}</p>
                      <CopyToClipboardButton text={groupID} />
                    </div>
                    <p className="group-id-message">
                      *send this group id to your team
                    </p>
                  </div>
                </div>
                <div>
                  <DownloadPdf groupName={groupName} groupID={groupID} />
                </div>
              </div>
            ) : null}
          </div>
          {displayFlag ? <RenderCards parentGroupId={groupID} /> : null}
        </div>
      </>
    );
  }
}

export default Manager;
