import React from "react";
import copy from "clipboard-copy";

class CopyToClipboardButton extends React.Component {
  state = { copyText: "Copy Group ID" };
  copyToClipboard = () => {
    const { text } = this.props;
    copy(text);
    this.setState({ copyText: "Copied!" });
    setTimeout(() => {
      this.setState({ copyText: "Copy Group ID" });
    }, 1500);
  };

  render() {
    const { copyText } = this.state;
    return (
      <button className="button" onClick={this.copyToClipboard}>
        {copyText}
      </button>
    );
  }
}

export default CopyToClipboardButton;
