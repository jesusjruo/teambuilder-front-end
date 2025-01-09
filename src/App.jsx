import { useState, createContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import SignupForm from "./components/SignupForm/SignupForm";
import SigninForm from "./components/SigninForm/SigninForm";
import * as authService from "../src/services/authService";
import TeamList from "./components/TeamList/TeamList";
import * as teamService from './services/teamService';


export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchAllTeams = async () => {
      const teamsData = await teamService.index();
      console.log('Teams: ', teamsData);
      setTeams(teamsData);
    };
    if (user) fetchAllTeams();
  }, [user]);


  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
          {user ? (
            // Protected Routes:
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route 
                path="/teams" 
                element={
                  <TeamList teams={teams}/>
                } 
              />
            </>
          ) : (
            // Public Route:
            <Route path="/" element={<Landing />} />
          )}
          <Route path="/signup" element={<SignupForm setUser={setUser} />} />
          <Route path="/signin" element={<SigninForm setUser={setUser} />} />
        </Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
