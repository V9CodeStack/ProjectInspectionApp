import { Route, Switch } from "react-router-dom";
import Home from "./components/Home/homeIndex";
import Manager from "./components/Manager/managerIndex";
import Team from "./components/Team/teamIndex";

const App = () => (
  <Switch>
    <Route exact path="/ProjectInspectionApp/" component={Home} />
    <Route exact path="/ProjectInspectionApp/manager" component={Manager} />
    <Route exact path="/ProjectInspectionApp/team" component={Team} />
  </Switch>
);

export default App;
