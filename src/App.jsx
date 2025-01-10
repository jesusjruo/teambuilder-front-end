import React, { useState, createContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import SignupForm from "./components/SignupForm/SignupForm";
import SigninForm from "./components/SigninForm/SigninForm";
import * as authService from "../src/services/authService";
import TeamList from "./components/TeamList/TeamList";
import * as teamService from './services/teamService';
import TeamComp from './components/TeamComp/TeamComp';

export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTeams = async () => {
      setLoading(true);
      const teamsData = await teamService.index();
      setTeams(teamsData);
      setLoading(false);
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
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route 
                path="/teams" 
                element={<TeamList teams={teams} setTeams={setTeams} loading={loading} />} 
              />
            </>
          ) : (
            <Route path="/" element={<Landing />} />
          )}
          <Route path="/signup" element={<SignupForm setUser={setUser} />} />
          <Route path="/signin" element={<SigninForm setUser={setUser} />} />
          <Route path="/team/:teamId" element={<TeamComp />} />
        </Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
