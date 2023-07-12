import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loader from "react-loader-spinner";

import relaxImg from "./relax-img.jpg";

import "./rendercards.css";

const RenderCards = (props) => {
  const { parentGroupId } = props;
  const [groupData, setGroupData] = useState([]);
  const groupID = Cookies.get("manager_group_id");

  const [goodInput, setGoodInput] = useState("");
  const [goodloader, setGoodLoader] = useState(false);
  const [goodCommentFlag, setGoodCommentFlag] = useState(false);
  const [goodFeedbackCommentId, setGoodFeedbackCommentId] = useState();

  const [badInput, setBadInput] = useState("");
  const [badloader, setBadLoader] = useState(false);
  const [badCommentFlag, setBadCommentFlag] = useState(false);
  const [badFeedbackCommentId, setBadFeedbackCommentId] = useState();

  const [ideasInput, setIdeasInput] = useState("");
  const [ideasloader, setIdeasLoader] = useState(false);
  const [ideasCommentFlag, setIdeasCommentFlag] = useState(false);
  const [ideasFeedbackCommentId, setIdeasFeedbackCommentId] = useState();

  const [actionsInput, setActionsInput] = useState("");
  const [actionsloader, setActionsLoader] = useState(false);
  const [actionsCommentFlag, setActionsCommentFlag] = useState(false);
  const [actionsFeedbackCommentId, setActionsFeedbackCommentId] = useState();

  const [kudosInput, setKudosInput] = useState("");
  const [kudosloader, setKudosLoader] = useState(false);
  const [kudosCommentFlag, setKudosCommentFlag] = useState(false);
  const [kudosFeedbackCommentId, setKudosFeedbackCommentId] = useState();

  useEffect(() => {
    if (groupID) {
      const interval = setInterval(() => mainGetData(), 5000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [groupID]);

  useEffect(() => {
    const groupID = Cookies.get("manager_group_id");
    if (groupID) {
      mainGetData();
    }
  }, [parentGroupId]);

  const mainGetData = async () => {
    const groupID = Cookies.get("manager_group_id");
    const url = `https://projectinspection.netlify.app/.netlify/functions/api/feedback/${groupID}`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok === true) {
      setGroupData(data);
    }
  };

  const renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="Oval" color="#0b69ff" height="40" width="25" />
    </div>
  );

  const renderLoadingSubmitView = () => (
    <div className="loader-submit-container">
      <Loader type="Oval" color="white" height="10px" width="15px" />
    </div>
  );

  /////////////////////////////////////////////////

  // RenderGood
  const handleChangeGoodInput = (e) => {
    setGoodInput(e.target.value);
  };

  const handleGoodInputSubmit = async (id) => {
    if (goodInput.length > 0) {
      setGoodLoader(true);
      const url = ` https://projectinspection.netlify.app/.netlify/functions/api/comment/${id}`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentMessage: `${goodInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        mainGetData();
        setGoodLoader(false);
        setGoodInput("");
        setGoodCommentFlag(false);
      }
    }
  };

  const cancelGoodSubmit = () => {
    setGoodCommentFlag(false);
    setGoodInput("");
  };

  const onClickGoodComment = (id) => {
    setGoodCommentFlag(true);
    setGoodFeedbackCommentId(id);
  };

  const renderGood = () => {
    if (groupData) {
      const good = groupData.filter(
        (value) =>
          value !== "" &&
          value !== null &&
          value !== undefined &&
          value.feedbackType === "Good"
      );
      return (
        <>
          <div className="main-card">
            <h1 className="card-header green">Good</h1>
            {good.length > 0
              ? good.map((eachValue) => (
                  <div key={eachValue._id} className="card green-card">
                    <p className="card-text">{eachValue.feedbackMessage}</p>
                    {eachValue.comments.length > 0 ? (
                      <div>
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
                          className="card-text Manager-Feedback-text"
                          style={{
                            paddingTop: "0px",
                            marginTop: "0px",
                            fontSize: "15px",
                          }}
                        >
                          {eachValue.comments[0].commentMessage}
                        </p>
                      </div>
                    ) : null}
                    {goodCommentFlag &&
                    eachValue._id === goodFeedbackCommentId ? (
                      <div
                        className="good-text-area"
                        style={{ marginTop: "5px" }}
                      >
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
                            onClick={() => handleGoodInputSubmit(eachValue._id)}
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
                    ) : null}
                    {!goodCommentFlag && eachValue.comments.length === 0 ? (
                      <div className="comment-card">
                        <button
                          style={{
                            fontSize: "10px",
                            padding: "5px",
                            marginTop: "5px",
                          }}
                          className="btn button-green"
                          onClick={() => onClickGoodComment(eachValue._id)}
                        >
                          Comment
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))
              : renderLoadingView()}
          </div>
        </>
      );
    }
  };

  /////////////////////////////////////////////////

  // RenderBad
  const handleChangeBadInput = (e) => {
    setBadInput(e.target.value);
  };

  const handleBadInputSubmit = async (id) => {
    if (badInput.length > 0) {
      setBadLoader(true);
      const url = ` https://projectinspection.netlify.app/.netlify/functions/api/comment/${id}`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentMessage: `${badInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        mainGetData();
        setBadLoader(false);
        setBadInput("");
        setBadCommentFlag(false);
      }
    }
  };

  const cancelBadSubmit = () => {
    setBadCommentFlag(false);
    setBadInput("");
  };

  const onClickBadComment = (id) => {
    setBadCommentFlag(true);
    setBadFeedbackCommentId(id);
  };

  const renderBad = () => {
    if (groupData) {
      const bad = groupData.filter(
        (value) =>
          value !== "" &&
          value !== null &&
          value !== undefined &&
          value.feedbackType === "Bad"
      );
      return (
        <>
          <div className="main-card">
            <h1 className="card-header pink">Bad</h1>
            {bad.length > 0
              ? bad.map((eachValue) => (
                  <div key={eachValue._id} className="card pink-card">
                    <p className="card-text">{eachValue.feedbackMessage}</p>
                    {eachValue.comments.length > 0 ? (
                      <div>
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
                          className="card-text Manager-Feedback-text"
                          style={{
                            paddingTop: "0px",
                            marginTop: "0px",
                            fontSize: "15px",
                          }}
                        >
                          {eachValue.comments[0].commentMessage}
                        </p>
                      </div>
                    ) : null}
                    {badCommentFlag &&
                    eachValue._id === badFeedbackCommentId ? (
                      <div
                        className="good-text-area"
                        style={{ marginTop: "5px" }}
                      >
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
                            onClick={() => handleBadInputSubmit(eachValue._id)}
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
                    ) : null}
                    {!badCommentFlag && eachValue.comments.length === 0 ? (
                      <div className="comment-card">
                        <button
                          style={{
                            fontSize: "10px",
                            padding: "5px",
                            marginTop: "5px",
                          }}
                          className="btn button-pink"
                          onClick={() => onClickBadComment(eachValue._id)}
                        >
                          Comment
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))
              : renderLoadingView()}
          </div>
        </>
      );
    }
  };

  /////////////////////////////////////////////////

  // RenderIdeas
  const handleChangeIdeasInput = (e) => {
    setIdeasInput(e.target.value);
  };

  const handleIdeasInputSubmit = async (id) => {
    if (ideasInput.length > 0) {
      setIdeasLoader(true);
      const url = ` https://projectinspection.netlify.app/.netlify/functions/api/comment/${id}`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentMessage: `${ideasInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        mainGetData();
        setIdeasLoader(false);
        setIdeasInput("");
        setIdeasCommentFlag(false);
      }
    }
  };

  const cancelIdeasSubmit = () => {
    setIdeasCommentFlag(false);
    setIdeasInput("");
  };

  const onClickIdeasComment = (id) => {
    setIdeasCommentFlag(true);
    setIdeasFeedbackCommentId(id);
  };

  const renderIdeas = () => {
    if (groupData) {
      const ideas = groupData.filter(
        (value) =>
          value !== "" &&
          value !== null &&
          value !== undefined &&
          value.feedbackType === "Ideas"
      );
      return (
        <>
          <div className="main-card">
            <h1 className="card-header brown">Ideas</h1>
            {ideas.length > 0
              ? ideas.map((eachValue) => (
                  <div key={eachValue._id} className="card brown-card">
                    <p className="card-text">{eachValue.feedbackMessage}</p>
                    {eachValue.comments.length > 0 ? (
                      <div>
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
                          className="card-text Manager-Feedback-text"
                          style={{
                            paddingTop: "0px",
                            marginTop: "0px",
                            fontSize: "15px",
                          }}
                        >
                          {eachValue.comments[0].commentMessage}
                        </p>
                      </div>
                    ) : null}
                    {ideasCommentFlag &&
                    eachValue._id === ideasFeedbackCommentId ? (
                      <div
                        className="good-text-area"
                        style={{ marginTop: "5px" }}
                      >
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
                            onClick={() =>
                              handleIdeasInputSubmit(eachValue._id)
                            }
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
                    ) : null}
                    {!ideasCommentFlag && eachValue.comments.length === 0 ? (
                      <div className="comment-card">
                        <button
                          style={{
                            fontSize: "10px",
                            padding: "5px",
                            marginTop: "5px",
                          }}
                          className="btn button-brown"
                          onClick={() => onClickIdeasComment(eachValue._id)}
                        >
                          Comment
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))
              : renderLoadingView()}
          </div>
        </>
      );
    }
  };

  /////////////////////////////////////////////////

  // RenderActions
  const handleChangeActionsInput = (e) => {
    setActionsInput(e.target.value);
  };

  const handleActionsInputSubmit = async (id) => {
    if (actionsInput.length > 0) {
      setActionsLoader(true);
      const url = ` https://projectinspection.netlify.app/.netlify/functions/api/comment/${id}`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentMessage: `${actionsInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        mainGetData();
        setActionsLoader(false);
        setActionsInput("");
        setActionsCommentFlag(false);
      }
    }
  };

  const cancelActionsSubmit = () => {
    setActionsCommentFlag(false);
    setActionsInput("");
  };

  const onClickActionsComment = (id) => {
    setActionsCommentFlag(true);
    setActionsFeedbackCommentId(id);
  };

  const renderActions = () => {
    if (groupData) {
      const actions = groupData.filter(
        (value) =>
          value !== "" &&
          value !== null &&
          value !== undefined &&
          value.feedbackType === "Actions"
      );
      return (
        <>
          <div className="main-card">
            <h1 className="card-header blue">Actions</h1>
            {actions.length > 0
              ? actions.map((eachValue) => (
                  <div key={eachValue._id} className="card blue-card">
                    <p className="card-text">{eachValue.feedbackMessage}</p>
                    {eachValue.comments.length > 0 ? (
                      <div>
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
                          className="card-text Manager-Feedback-text"
                          style={{
                            paddingTop: "0px",
                            marginTop: "0px",
                            fontSize: "15px",
                          }}
                        >
                          {eachValue.comments[0].commentMessage}
                        </p>
                      </div>
                    ) : null}
                    {actionsCommentFlag &&
                    eachValue._id === actionsFeedbackCommentId ? (
                      <div
                        className="good-text-area"
                        style={{ marginTop: "5px" }}
                      >
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
                            onClick={() =>
                              handleActionsInputSubmit(eachValue._id)
                            }
                          >
                            {actionsloader
                              ? renderLoadingSubmitView()
                              : "Submit"}
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
                    ) : null}
                    {!actionsCommentFlag && eachValue.comments.length === 0 ? (
                      <div className="comment-card">
                        <button
                          style={{
                            fontSize: "10px",
                            padding: "5px",
                            marginTop: "5px",
                          }}
                          className="btn button-blue"
                          onClick={() => onClickActionsComment(eachValue._id)}
                        >
                          Comment
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))
              : renderLoadingView()}
          </div>
        </>
      );
    }
  };

  /////////////////////////////////////////////////

  // RenderKudos
  const handleChangeKudosInput = (e) => {
    setKudosInput(e.target.value);
  };

  const handleKudosInputSubmit = async (id) => {
    if (kudosInput.length > 0) {
      setKudosLoader(true);
      const url = ` https://projectinspection.netlify.app/.netlify/functions/api/comment/${id}`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentMessage: `${kudosInput}`,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok === true) {
        mainGetData();
        setKudosLoader(false);
        setKudosInput("");
        setKudosCommentFlag(false);
      }
    }
  };

  const cancelKudosSubmit = () => {
    setKudosCommentFlag(false);
    setKudosInput("");
  };

  const onClickKudosComment = (id) => {
    setKudosCommentFlag(true);
    setKudosFeedbackCommentId(id);
  };

  const renderKudos = () => {
    if (groupData) {
      const kudos = groupData.filter(
        (value) =>
          value !== "" &&
          value !== null &&
          value !== undefined &&
          value.feedbackType === "Kudos"
      );
      return (
        <>
          <div className="main-card">
            <h1 className="card-header cyan">Kudos</h1>
            {kudos.length > 0
              ? kudos.map((eachValue) => (
                  <div key={eachValue._id} className="card cyan-card">
                    <p className="card-text">{eachValue.feedbackMessage}</p>
                    {eachValue.comments.length > 0 ? (
                      <div>
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
                          className="card-text Manager-Feedback-text"
                          style={{
                            paddingTop: "0px",
                            marginTop: "0px",
                            fontSize: "15px",
                          }}
                        >
                          {eachValue.comments[0].commentMessage}
                        </p>
                      </div>
                    ) : null}
                    {kudosCommentFlag &&
                    eachValue._id === kudosFeedbackCommentId ? (
                      <div
                        className="good-text-area"
                        style={{ marginTop: "5px" }}
                      >
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
                            onClick={() =>
                              handleKudosInputSubmit(eachValue._id)
                            }
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
                    ) : null}
                    {!kudosCommentFlag && eachValue.comments.length === 0 ? (
                      <div className="comment-card">
                        <button
                          style={{
                            fontSize: "10px",
                            padding: "5px",
                            marginTop: "5px",
                          }}
                          className="btn button-cyan"
                          onClick={() => onClickKudosComment(eachValue._id)}
                        >
                          Comment
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))
              : renderLoadingView()}
          </div>
        </>
      );
    }
  };

  return (
    <>
      <div className="render-all-cards-container">
        {renderGood()}
        {renderBad()}
        {renderIdeas()}
        {renderActions()}
        {renderKudos()}
      </div>
      {groupData.length === 0 ? (
        <div className="img-container">
          <h1 className="description">
            Send Group ID to your team then Sit and Relax, I will show you as
            soon as I got feedback from your Team.
          </h1>
          <img className="img" src={relaxImg} />
        </div>
      ) : null}
    </>
  );
};

export default RenderCards;
