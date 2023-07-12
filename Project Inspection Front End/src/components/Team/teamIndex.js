import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import NavBar from "../NavBar/navIndex";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import TeamCards from "../TeamCards/teamcards";
import "./teamIndex.css";

const Team = () => {
  const [inputGroupId, setInputGroupId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loader, setLoader] = useState(true);

  const [createGroupFlag, setCreateGroupFlag] = useState(true);
  const [errorFlag, setErrorFlag] = useState(false);
  const [resetFlag, setResetFlag] = useState(false);

  useEffect(() => {
    const groupNameCookie = Cookies.get("group_name");
    const groupIdCookie = Cookies.get("group_id");
    if (groupIdCookie !== undefined) {
      setGroupId(groupIdCookie);
      setGroupName(groupNameCookie);
    }
  }, []);

  const onChangeInput = (e) => {
    setInputGroupId(e.target.value);
  };

  const activateGroup = async () => {
    if (inputGroupId.length > 0) {
      setLoader(true);
      const feedBackIdsCookie = await Cookies.get("feedBackIds");

      const groupId = await Cookies.get("group_id");
      setCreateGroupFlag(false);
      //get GroupName
      const url = `https://projectinspection.netlify.app/.netlify/functions/api/group/${inputGroupId}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok === true) {
        if (feedBackIdsCookie !== undefined && groupId !== inputGroupId) {
          let dummyId = ["3473749374"];
          Cookies.set("feedBackIds", dummyId, { expires: 1 });
        }
        await setErrorFlag(false);
        await setGroupId(inputGroupId);
        await setGroupName(data.name);
        await setLoader(false);
        await setCreateGroupFlag(false);
        await resetGroupCreated();
        await Cookies.set("group_name", data.name, { expires: 1 });
        await Cookies.set("group_id", inputGroupId, { expires: 1 });
        await setInputGroupId("");
        setResetFlag(!resetFlag);
      } else {
        setCreateGroupFlag(true);
        setErrorFlag(true);
        setLoader(false);
      }
    }
  };

  // Loading View
  const renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="Oval" color="white" height="18" width="18" />
    </div>
  );

  const renderGroupCreated = () => {
    return <>{loader ? renderLoadingView() : "Activated"}</>;
  };

  const resetGroupCreated = () => {
    setTimeout(() => setCreateGroupFlag(true), 5000);
  };

  return (
    <>
      <NavBar groupName={groupName} />
      <div className="team-container">
        <div className="main-input-container">
          <div className="input-container">
            <input
              type="text"
              className="inputs inputs-team"
              value={inputGroupId}
              placeholder="Enter Group ID"
              onChange={onChangeInput}
            />
            <button
              type="button"
              style={{ width: "95px", height: "30px" }}
              className="button-activate"
              onClick={activateGroup}
            >
              {createGroupFlag ? "Activate" : renderGroupCreated()}
            </button>
          </div>
          <div>
            {errorFlag && (
              <p className="error-message">
                You have entered the wrong Group ID! Please verify it with your
                manager.
              </p>
            )}
          </div>
          <div>{!errorFlag && <TeamCards componentGroupId={groupId} />}</div>
        </div>
      </div>
    </>
  );
};

export default Team;
