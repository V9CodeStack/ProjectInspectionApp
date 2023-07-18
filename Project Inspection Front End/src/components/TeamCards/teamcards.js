import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "./teamcards.css";
import "../RenderCards/rendercards.css";

const TeamCards = (props) => {
  const { componentGroupId } = props;
  let groupID = Cookies.get("group_id");
  const [ids, setIds] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [mainloader, setMainLoader] = useState();

  const [goodInput, setGoodInput] = useState("");
  const [goodEditFlag, setGoodEditFlag] = useState(false);
  const [goodFeedbackId, setGoodFeedBackId] = useState("");
  const [goodloader, setGoodLoader] = useState(false);
  const [goodNewCard, setGoodNewCard] = useState(false);

  const [badInput, setBadInput] = useState("");
  const [badEditFlag, setBadEditFlag] = useState(false);
  const [badFeedbackId, setBadFeedBackId] = useState("");
  const [badloader, setBadLoader] = useState(false);
  const [badNewCard, setBadNewCard] = useState(false);

  const [ideasInput, setIdeasInput] = useState("");
  const [ideasEditFlag, setIdeasEditFlag] = useState(false);
  const [ideasFeedbackId, setIdeasFeedBackId] = useState("");
  const [ideasloader, setIdeasLoader] = useState(false);
  const [ideasNewCard, setIdeasNewCard] = useState(false);

  const [actionsInput, setActionsInput] = useState("");
  const [actionsEditFlag, setActionsEditFlag] = useState(false);
  const [actionsFeedbackId, setActionsFeedBackId] = useState("");
  const [actionsloader, setActionsLoader] = useState(false);
  const [actionsNewCard, setActionsNewCard] = useState(false);

  const [kudosInput, setKudosInput] = useState("");
  const [kudosEditFlag, setKudosEditFlag] = useState(false);
  const [kudosFeedbackId, setKudosFeedBackId] = useState("");
  const [kudosloader, setKudosLoader] = useState(false);
  const [kudosNewCard, setKudosNewCard] = useState(false);

  useEffect(() => {
    if (groupID) {
      const interval = setInterval(() => mainGetData(), 6000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [groupID]);

  useEffect(() => {
    if (groupID) {
      setMainLoader(true);
      mainGetData();
    }
  }, [componentGroupId]);

  const mainGetData = async () => {
    const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${groupID}`;
    const response = await fetch(url);
    const data = await response.json();
    const feedBackIdsCookie = await Cookies.get("feedBackIds");
    if (response.ok === true) {
      setMainLoader(false);
      if (feedBackIdsCookie !== undefined) {
        var idsArray = feedBackIdsCookie.split(",");
        const filteredData = data.filter((item) => idsArray.includes(item._id));
        await setGroupData(filteredData);
      }
    }
  };

  // Delete Feedback
  const deleteFeedback = async (id) => {
    const deleteThisId = groupData.filter((item) => item._id !== id);
    setGroupData(deleteThisId);
    const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${id}`;
    const options = {
      method: "DELETE",
    };
    await fetch(url, options);
  };

  // Loading View
  const renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="Oval" color="white" height="18" width="18" />
    </div>
  );

  // Main Loading View
  const mainrenderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="Oval" color="blue" height="30" width="30" />
    </div>
  );

  const renderLoadingSubmitView = () => (
    <div className="loader-submit-container">
      <Loader type="Oval" color="white" height="10px" width="15px" />
    </div>
  );

  ////////////////////////////////////////////////////////////////////////////

  //// renderGood /////
  const handleChangeGoodInput = (e) => {
    setGoodInput(e.target.value);
  };

  const handleGoodInputSubmit = async () => {
    if (goodInput.length > 0 && goodEditFlag === false) {
      setGoodLoader(true);
      const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${groupID}`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackType: "Good",
          feedbackMessage: `${goodInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        let totalIds = [data._id];
        const feedBackIdsCookie = await Cookies.get("feedBackIds");
        if (feedBackIdsCookie !== undefined) {
          var idsArray = feedBackIdsCookie.split(",");
          totalIds = [...idsArray, ...totalIds];
        }
        Cookies.set("feedBackIds", totalIds, { expires: 1 });
        setGoodNewCard(false);
        await setGroupData([...groupData, data]);
        await setIds(totalIds);
        setGoodInput("");
        setGoodLoader(false);
      }
    } else if (goodInput.length > 0 && goodEditFlag === true) {
      setGoodLoader(true);
      const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${goodFeedbackId}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackMessage: `${goodInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        let totalIds = [data._id];
        const feedBackIdsCookie = await Cookies.get("feedBackIds");
        var idsArray = feedBackIdsCookie.split(",");
        totalIds = [...idsArray, ...totalIds];
        Cookies.set("feedBackIds", totalIds, { expires: 1 });
        await mainGetData();
        setGoodInput("");
        setGoodEditFlag(false);
        setGoodLoader(false);
      }
    }
  };

  const goodEdit = async (id, msg) => {
    setGoodInput(msg);
    setGoodFeedBackId(id);
    setGoodEditFlag(true);
  };

  const goodDelete = async (id) => {
    const feedBackIdsCookie = await Cookies.get("feedBackIds");
    let idsArray = feedBackIdsCookie
      .split(",")
      .filter((itemId) => itemId !== id);
    Cookies.set("feedBackIds", idsArray, { expires: 1 });
    deleteFeedback(id);
  };

  const cancelGoodSubmit = () => {
    setGoodNewCard(false);
    setGoodInput("");
    setGoodEditFlag(false);
  };

  const onClickAddGoodNewCard = () => {
    setGoodNewCard(true);
  };

  const goodTextArea = () => {
    return (
      <div className="good-text-area" style={{ marginTop: "5px" }}>
        <textarea
          style={{ border: "1px solid gray" }}
          className="textarea green-card"
          placeholder="Enter Your Feedback"
          value={goodInput}
          onChange={handleChangeGoodInput}
          rows={4}
          cols={27}
        />
        <div className="submit-cancel-buttons">
          <button
            style={{
              fontSize: "10px",
              padding: "5px",
              width: "45px",
            }}
            type="button"
            className="btn button-green"
            onClick={handleGoodInputSubmit}
          >
            {goodloader ? renderLoadingSubmitView() : "Submit"}
          </button>
          <button
            style={{ fontSize: "10px", padding: "5px" }}
            type="button"
            className="btn button-green"
            onClick={cancelGoodSubmit}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderGood = () => {
    return (
      <>
        <div className="main-card">
          <h1 className="card-header green">Good</h1>
          {!goodNewCard ? (
            <div className="add-new-card-container">
              <button
                className="add-new-card-button green-btn-card"
                type="button"
                onClick={onClickAddGoodNewCard}
              >
                + Add New Card
              </button>
            </div>
          ) : null}
          {goodNewCard ? goodTextArea() : null}
          {groupData
            .filter(
              (item) =>
                item !== "" &&
                item !== null &&
                item !== undefined &&
                item.feedbackType === "Good"
            )
            .map((eachItem) => (
              <div key={eachItem._id} className="card green-card">
                <p className="card-text">{eachItem.feedbackMessage}</p>
                {eachItem.comments.length > 0 ? (
                  <div className="manager-feedback-container">
                    <p
                      className="card-text"
                      style={{
                        paddingBottom: "0px",
                        marginBottom: "0px",
                        textDecoration: "underline",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      Manager Feedback:
                    </p>
                    <p
                      className="card-text"
                      style={{
                        paddingTop: "0px",
                        marginTop: "0px",
                        fontSize: "15px",
                      }}
                    >
                      {eachItem.comments[0].commentMessage}
                    </p>
                  </div>
                ) : null}
                {eachItem.comments[0] &&
                eachItem.comments[0].commentMessage ? null : (
                  <div className="edit-delete-container">
                    {goodEditFlag && eachItem._id === goodFeedbackId ? (
                      goodTextArea()
                    ) : (
                      <div>
                        <hr />
                        <div className="edit-delete-buttons">
                          <button
                            style={{ fontSize: "10px", padding: "5px" }}
                            className="btn button-green"
                            onClick={() => goodDelete(eachItem._id)}
                          >
                            Delete
                          </button>
                          <button
                            style={{
                              fontSize: "10px",
                              padding: "5px",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                            }}
                            className="btn button-green"
                            onClick={() =>
                              goodEdit(eachItem._id, eachItem.feedbackMessage)
                            }
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </>
    );
  };

  //// renderBad /////
  const handleChangeBadInput = (e) => {
    setBadInput(e.target.value);
  };

  const handleBadInputSubmit = async () => {
    if (badInput.length > 0 && badEditFlag === false) {
      setBadLoader(true);
      const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${groupID}`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackType: "Bad",
          feedbackMessage: `${badInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        let totalIds = [data._id];
        const feedBackIdsCookie = await Cookies.get("feedBackIds");
        if (feedBackIdsCookie !== undefined) {
          var idsArray = feedBackIdsCookie.split(",");
          totalIds = [...idsArray, ...totalIds];
        }
        Cookies.set("feedBackIds", totalIds, { expires: 1 });
        setBadNewCard(false);
        await setGroupData([...groupData, data]);
        await setIds(totalIds);
        setBadInput("");
        setBadLoader(false);
      }
    } else if (badInput.length > 0 && badEditFlag === true) {
      setBadLoader(true);
      const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${badFeedbackId}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackMessage: `${badInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        let totalIds = [data._id];
        const feedBackIdsCookie = await Cookies.get("feedBackIds");
        var idsArray = feedBackIdsCookie.split(",");
        totalIds = [...idsArray, ...totalIds];
        Cookies.set("feedBackIds", totalIds, { expires: 1 });
        await mainGetData();
        setBadInput("");
        setBadEditFlag(false);
        setBadLoader(false);
      }
    }
  };

  const badEdit = async (id, msg) => {
    setBadInput(msg);
    setBadFeedBackId(id);
    setBadEditFlag(true);
  };

  const badDelete = async (id) => {
    const feedBackIdsCookie = await Cookies.get("feedBackIds");
    let idsArray = feedBackIdsCookie
      .split(",")
      .filter((itemId) => itemId !== id);
    Cookies.set("feedBackIds", idsArray, { expires: 1 });
    deleteFeedback(id);
  };

  const cancelBadSubmit = () => {
    setBadNewCard(false);
    setBadInput("");
    setBadEditFlag(false);
  };

  const onClickAddBadNewCard = () => {
    setBadNewCard(true);
  };

  const badTextArea = () => {
    return (
      <div className="good-text-area" style={{ marginTop: "5px" }}>
        <textarea
          style={{ border: "1px solid gray" }}
          className="textarea pink-card"
          placeholder="Enter Your Feedback"
          value={badInput}
          onChange={handleChangeBadInput}
          rows={4}
          cols={27}
        />
        <div className="submit-cancel-buttons">
          <button
            style={{
              fontSize: "10px",
              padding: "5px",
              width: "45px",
            }}
            type="button"
            className="btn button-pink"
            onClick={handleBadInputSubmit}
          >
            {badloader ? renderLoadingSubmitView() : "Submit"}
          </button>
          <button
            style={{ fontSize: "10px", padding: "5px" }}
            type="button"
            className="btn button-pink"
            onClick={cancelBadSubmit}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderBad = () => {
    return (
      <>
        <div className="main-card">
          <h1 className="card-header pink">Bad</h1>
          {!badNewCard ? (
            <div className="add-new-card-container">
              <button
                className="add-new-card-button pink-btn-card"
                type="button"
                onClick={onClickAddBadNewCard}
              >
                + Add New Card
              </button>
            </div>
          ) : null}
          {badNewCard ? badTextArea() : null}
          {groupData
            .filter(
              (item) =>
                item !== "" &&
                item !== null &&
                item !== undefined &&
                item.feedbackType === "Bad"
            )
            .map((eachItem) => (
              <div key={eachItem._id} className="card pink-card">
                <p className="card-text">{eachItem.feedbackMessage}</p>
                {eachItem.comments.length > 0 ? (
                  <div className="manager-feedback-container">
                    <p
                      className="card-text"
                      style={{
                        paddingBottom: "0px",
                        marginBottom: "0px",
                        textDecoration: "underline",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      Manager Feedback:
                    </p>
                    <p
                      className="card-text"
                      style={{
                        paddingTop: "0px",
                        marginTop: "0px",
                        fontSize: "15px",
                      }}
                    >
                      {eachItem.comments[0].commentMessage}
                    </p>
                  </div>
                ) : null}
                {eachItem.comments[0] &&
                eachItem.comments[0].commentMessage ? null : (
                  <div className="edit-delete-container">
                    {badEditFlag && eachItem._id === badFeedbackId ? (
                      badTextArea()
                    ) : (
                      <div>
                        <hr />
                        <div className="edit-delete-buttons">
                          <button
                            style={{ fontSize: "10px", padding: "5px" }}
                            className="btn button-pink"
                            onClick={() => badDelete(eachItem._id)}
                          >
                            Delete
                          </button>
                          <button
                            style={{
                              fontSize: "10px",
                              padding: "5px",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                            }}
                            className="btn button-pink"
                            onClick={() =>
                              badEdit(eachItem._id, eachItem.feedbackMessage)
                            }
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </>
    );
  };

  //// renderIdeas /////
  const handleChangeIdeasInput = (e) => {
    setIdeasInput(e.target.value);
  };

  const handleIdeasInputSubmit = async () => {
    if (ideasInput.length > 0 && ideasEditFlag === false) {
      setIdeasLoader(true);
      const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${groupID}`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackType: "Ideas",
          feedbackMessage: `${ideasInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        let totalIds = [data._id];
        const feedBackIdsCookie = await Cookies.get("feedBackIds");
        if (feedBackIdsCookie !== undefined) {
          var idsArray = feedBackIdsCookie.split(",");
          totalIds = [...idsArray, ...totalIds];
        }
        Cookies.set("feedBackIds", totalIds, { expires: 1 });
        setIdeasNewCard(false);
        await setGroupData([...groupData, data]);
        await setIds(totalIds);
        setIdeasInput("");
        setIdeasLoader(false);
      }
    } else if (ideasInput.length > 0 && ideasEditFlag === true) {
      setIdeasLoader(true);
      const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${ideasFeedbackId}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackMessage: `${ideasInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        let totalIds = [data._id];
        const feedBackIdsCookie = await Cookies.get("feedBackIds");
        var idsArray = feedBackIdsCookie.split(",");
        totalIds = [...idsArray, ...totalIds];
        Cookies.set("feedBackIds", totalIds, { expires: 1 });
        await mainGetData();
        setIdeasInput("");
        setIdeasEditFlag(false);
        setIdeasLoader(false);
      }
    }
  };

  const ideasEdit = async (id, msg) => {
    setIdeasInput(msg);
    setIdeasFeedBackId(id);
    setIdeasEditFlag(true);
  };

  const ideasDelete = async (id) => {
    const feedBackIdsCookie = await Cookies.get("feedBackIds");
    let idsArray = feedBackIdsCookie
      .split(",")
      .filter((itemId) => itemId !== id);
    Cookies.set("feedBackIds", idsArray, { expires: 1 });
    deleteFeedback(id);
  };

  const cancelIdeasSubmit = () => {
    setIdeasNewCard(false);
    setIdeasInput("");
    setIdeasEditFlag(false);
  };

  const onClickAddIdeasNewCard = () => {
    setIdeasNewCard(true);
  };

  const ideasTextArea = () => {
    return (
      <div className="good-text-area" style={{ marginTop: "5px" }}>
        <textarea
          style={{ border: "1px solid gray" }}
          className="textarea brown-card"
          placeholder="Enter Your Feedback"
          value={ideasInput}
          onChange={handleChangeIdeasInput}
          rows={4}
          cols={27}
        />
        <div className="submit-cancel-buttons">
          <button
            style={{
              fontSize: "10px",
              padding: "5px",
              width: "45px",
            }}
            type="button"
            className="btn button-brown"
            onClick={handleIdeasInputSubmit}
          >
            {ideasloader ? renderLoadingSubmitView() : "Submit"}
          </button>
          <button
            style={{ fontSize: "10px", padding: "5px" }}
            type="button"
            className="btn button-brown"
            onClick={cancelIdeasSubmit}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderIdeas = () => {
    return (
      <>
        <div className="main-card">
          <h1 className="card-header brown">Ideas</h1>
          {!ideasNewCard ? (
            <div className="add-new-card-container">
              <button
                className="add-new-card-button brown-btn-card"
                type="button"
                onClick={onClickAddIdeasNewCard}
              >
                + Add New Card
              </button>
            </div>
          ) : null}
          {ideasNewCard ? ideasTextArea() : null}
          {groupData
            .filter(
              (item) =>
                item !== "" &&
                item !== null &&
                item !== undefined &&
                item.feedbackType === "Ideas"
            )
            .map((eachItem) => (
              <div key={eachItem._id} className="card brown-card">
                <p className="card-text">{eachItem.feedbackMessage}</p>
                {eachItem.comments.length > 0 ? (
                  <div className="manager-feedback-container">
                    <p
                      className="card-text"
                      style={{
                        paddingBottom: "0px",
                        marginBottom: "0px",
                        textDecoration: "underline",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      Manager Feedback:
                    </p>
                    <p
                      className="card-text"
                      style={{
                        paddingTop: "0px",
                        marginTop: "0px",
                        fontSize: "15px",
                      }}
                    >
                      {eachItem.comments[0].commentMessage}
                    </p>
                  </div>
                ) : null}
                {eachItem.comments[0] &&
                eachItem.comments[0].commentMessage ? null : (
                  <div className="edit-delete-container">
                    {ideasEditFlag && eachItem._id === ideasFeedbackId ? (
                      ideasTextArea()
                    ) : (
                      <div>
                        <hr />
                        <div className="edit-delete-buttons">
                          <button
                            style={{ fontSize: "10px", padding: "5px" }}
                            className="btn button-brown"
                            onClick={() => ideasDelete(eachItem._id)}
                          >
                            Delete
                          </button>
                          <button
                            style={{
                              fontSize: "10px",
                              padding: "5px",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                            }}
                            className="btn button-brown"
                            onClick={() =>
                              ideasEdit(eachItem._id, eachItem.feedbackMessage)
                            }
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </>
    );
  };

  //// renderActions /////
  const handleChangeActionsInput = (e) => {
    setActionsInput(e.target.value);
  };

  const handleActionsInputSubmit = async () => {
    if (actionsInput.length > 0 && actionsEditFlag === false) {
      setActionsLoader(true);
      const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${groupID}`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackType: "Actions",
          feedbackMessage: `${actionsInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        let totalIds = [data._id];
        const feedBackIdsCookie = await Cookies.get("feedBackIds");
        if (feedBackIdsCookie !== undefined) {
          var idsArray = feedBackIdsCookie.split(",");
          totalIds = [...idsArray, ...totalIds];
        }
        Cookies.set("feedBackIds", totalIds, { expires: 1 });
        setActionsNewCard(false);
        await setGroupData([...groupData, data]);
        await setIds(totalIds);
        setActionsInput("");
        setActionsLoader(false);
      }
    } else if (actionsInput.length > 0 && actionsEditFlag === true) {
      setActionsLoader(true);
      const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${actionsFeedbackId}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackMessage: `${actionsInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        let totalIds = [data._id];
        const feedBackIdsCookie = await Cookies.get("feedBackIds");
        var idsArray = feedBackIdsCookie.split(",");
        totalIds = [...idsArray, ...totalIds];
        Cookies.set("feedBackIds", totalIds, { expires: 1 });
        await mainGetData();
        setActionsInput("");
        setActionsEditFlag(false);
        setActionsLoader(false);
      }
    }
  };

  const actionsEdit = async (id, msg) => {
    setActionsInput(msg);
    setActionsFeedBackId(id);
    setActionsEditFlag(true);
  };

  const actionsDelete = async (id) => {
    const feedBackIdsCookie = await Cookies.get("feedBackIds");
    let idsArray = feedBackIdsCookie
      .split(",")
      .filter((itemId) => itemId !== id);
    Cookies.set("feedBackIds", idsArray, { expires: 1 });
    deleteFeedback(id);
  };

  const cancelActionsSubmit = () => {
    setActionsNewCard(false);
    setActionsInput("");
    setActionsEditFlag(false);
  };

  const onClickAddActionsNewCard = () => {
    setActionsNewCard(true);
  };

  const actionsTextArea = () => {
    return (
      <div className="good-text-area" style={{ marginTop: "5px" }}>
        <textarea
          style={{ border: "1px solid gray" }}
          className="textarea blue-card"
          placeholder="Enter Your Feedback"
          value={actionsInput}
          onChange={handleChangeActionsInput}
          rows={4}
          cols={27}
        />
        <div className="submit-cancel-buttons">
          <button
            style={{
              fontSize: "10px",
              padding: "5px",
              width: "45px",
            }}
            type="button"
            className="btn button-blue"
            onClick={handleActionsInputSubmit}
          >
            {actionsloader ? renderLoadingSubmitView() : "Submit"}
          </button>
          <button
            style={{ fontSize: "10px", padding: "5px" }}
            type="button"
            className="btn button-blue"
            onClick={cancelActionsSubmit}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderActions = () => {
    return (
      <>
        <div className="main-card">
          <h1 className="card-header blue">Actions</h1>
          {!actionsNewCard ? (
            <div className="add-new-card-container">
              <button
                className="add-new-card-button blue-btn-card"
                type="button"
                onClick={onClickAddActionsNewCard}
              >
                + Add New Card
              </button>
            </div>
          ) : null}
          {actionsNewCard ? actionsTextArea() : null}
          {groupData
            .filter(
              (item) =>
                item !== "" &&
                item !== null &&
                item !== undefined &&
                item.feedbackType === "Actions"
            )
            .map((eachItem) => (
              <div key={eachItem._id} className="card blue-card">
                <p className="card-text">{eachItem.feedbackMessage}</p>
                {eachItem.comments.length > 0 ? (
                  <div className="manager-feedback-container">
                    <p
                      className="card-text"
                      style={{
                        paddingBottom: "0px",
                        marginBottom: "0px",
                        textDecoration: "underline",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      Manager Feedback:
                    </p>
                    <p
                      className="card-text"
                      style={{
                        paddingTop: "0px",
                        marginTop: "0px",
                        fontSize: "15px",
                      }}
                    >
                      {eachItem.comments[0].commentMessage}
                    </p>
                  </div>
                ) : null}
                {eachItem.comments[0] &&
                eachItem.comments[0].commentMessage ? null : (
                  <div className="edit-delete-container">
                    {actionsEditFlag && eachItem._id === actionsFeedbackId ? (
                      actionsTextArea()
                    ) : (
                      <div>
                        <hr />
                        <div className="edit-delete-buttons">
                          <button
                            style={{ fontSize: "10px", padding: "5px" }}
                            className="btn button-blue"
                            onClick={() => actionsDelete(eachItem._id)}
                          >
                            Delete
                          </button>
                          <button
                            style={{
                              fontSize: "10px",
                              padding: "5px",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                            }}
                            className="btn button-blue"
                            onClick={() =>
                              actionsEdit(
                                eachItem._id,
                                eachItem.feedbackMessage
                              )
                            }
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </>
    );
  };

  //// renderKudos /////
  const handleChangeKudosInput = (e) => {
    setKudosInput(e.target.value);
  };

  const handlekudosInputSubmit = async () => {
    if (kudosInput.length > 0 && kudosEditFlag === false) {
      setKudosLoader(true);
      const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${groupID}`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackType: "Kudos",
          feedbackMessage: `${kudosInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        let totalIds = [data._id];
        const feedBackIdsCookie = await Cookies.get("feedBackIds");
        if (feedBackIdsCookie !== undefined) {
          var idsArray = feedBackIdsCookie.split(",");
          totalIds = [...idsArray, ...totalIds];
        }
        Cookies.set("feedBackIds", totalIds, { expires: 1 });
        setKudosNewCard(false);
        await setGroupData([...groupData, data]);
        await setIds(totalIds);
        setKudosInput("");
        setKudosLoader(false);
      }
    } else if (kudosInput.length > 0 && kudosEditFlag === true) {
      setKudosLoader(true);
      const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${kudosFeedbackId}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackMessage: `${kudosInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        let totalIds = [data._id];
        const feedBackIdsCookie = await Cookies.get("feedBackIds");
        var idsArray = feedBackIdsCookie.split(",");
        totalIds = [...idsArray, ...totalIds];
        Cookies.set("feedBackIds", totalIds, { expires: 1 });
        await mainGetData();
        setKudosInput("");
        setKudosEditFlag(false);
        setKudosLoader(false);
      }
    }
  };

  const kudosEdit = async (id, msg) => {
    setKudosInput(msg);
    setKudosFeedBackId(id);
    setKudosEditFlag(true);
  };

  const kudosDelete = async (id) => {
    const feedBackIdsCookie = await Cookies.get("feedBackIds");
    let idsArray = feedBackIdsCookie
      .split(",")
      .filter((itemId) => itemId !== id);
    Cookies.set("feedBackIds", idsArray, { expires: 1 });
    deleteFeedback(id);
  };

  const cancelKudosSubmit = () => {
    setKudosNewCard(false);
    setKudosInput("");
    setKudosEditFlag(false);
  };

  const onClickAddKudosNewCard = () => {
    setKudosNewCard(true);
  };

  const kudosTextArea = () => {
    return (
      <div className="good-text-area" style={{ marginTop: "5px" }}>
        <textarea
          style={{ border: "1px solid gray" }}
          className="textarea cyan-card"
          placeholder="Enter Your Feedback"
          value={kudosInput}
          onChange={handleChangeKudosInput}
          rows={4}
          cols={27}
        />
        <div className="submit-cancel-buttons">
          <button
            style={{
              fontSize: "10px",
              padding: "5px",
              width: "45px",
            }}
            type="button"
            className="btn button-cyan"
            onClick={handlekudosInputSubmit}
          >
            {kudosloader ? renderLoadingSubmitView() : "Submit"}
          </button>
          <button
            style={{ fontSize: "10px", padding: "5px" }}
            type="button"
            className="btn button-cyan"
            onClick={cancelKudosSubmit}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderKudos = () => {
    return (
      <>
        <div className="main-card">
          <h1 className="card-header cyan">Kudos</h1>
          {!kudosNewCard ? (
            <div className="add-new-card-container">
              <button
                className="add-new-card-button cyan-btn-card"
                type="button"
                onClick={onClickAddKudosNewCard}
              >
                + Add New Card
              </button>
            </div>
          ) : null}
          {kudosNewCard ? kudosTextArea() : null}
          {groupData
            .filter(
              (item) =>
                item !== "" &&
                item !== null &&
                item !== undefined &&
                item.feedbackType === "Kudos"
            )
            .map((eachItem) => (
              <div key={eachItem._id} className="card cyan-card">
                <p className="card-text">{eachItem.feedbackMessage}</p>
                {eachItem.comments.length > 0 ? (
                  <div className="manager-feedback-container">
                    <p
                      className="card-text"
                      style={{
                        paddingBottom: "0px",
                        marginBottom: "0px",
                        textDecoration: "underline",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      Manager Feedback:
                    </p>
                    <p
                      className="card-text"
                      style={{
                        paddingTop: "0px",
                        marginTop: "0px",
                        fontSize: "15px",
                      }}
                    >
                      {eachItem.comments[0].commentMessage}
                    </p>
                  </div>
                ) : null}
                {eachItem.comments[0] &&
                eachItem.comments[0].commentMessage ? null : (
                  <div className="edit-delete-container">
                    {kudosEditFlag && eachItem._id === kudosFeedbackId ? (
                      kudosTextArea()
                    ) : (
                      <div>
                        <hr />
                        <div className="edit-delete-buttons">
                          <button
                            style={{ fontSize: "10px", padding: "5px" }}
                            className="btn button-cyan"
                            onClick={() => kudosDelete(eachItem._id)}
                          >
                            Delete
                          </button>
                          <button
                            style={{
                              fontSize: "10px",
                              padding: "5px",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                            }}
                            className="btn button-cyan"
                            onClick={() =>
                              kudosEdit(eachItem._id, eachItem.feedbackMessage)
                            }
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </>
    );
  };

  return (
    <>
      <div>
        {groupID ? (
          <p className="group-message">*Group ID is Activated: {groupID} </p>
        ) : null}
      </div>
      {groupID ? (
        <div>
          {!mainloader ? (
            <div className="render-all-cards-container">
              {renderGood()}
              {renderBad()}
              {renderIdeas()}
              {renderActions()}
              {renderKudos()}
            </div>
          ) : (
            <div className="main-loadingview">{mainrenderLoadingView()}</div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default TeamCards;
