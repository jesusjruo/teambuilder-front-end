import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as teamService from '../../services/teamService';
import Loader from '../../public/Loader/Loader';
import "./styles.css";

const TeamList = ({ teams, setTeams, loading }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    members_amount: 1,
    level: "",
  });

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    updateMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (teamId) => {
    try {
      await teamService.remove(teamId);
      setTeams((prevTeams) => prevTeams.filter((team) => team.url.split("/").pop() !== teamId)); //REVISAR
    } catch (err) {
      updateMessage("Failed to delete team.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTeam = await teamService.create(formData);
      if (newTeam) {
        setFormData({
          name: "",
          members_amount: 1,
          level: "",
        });
        setModalOpen(false);
        setTeams((prevTeams) => [...prevTeams, newTeam]);
      }
    } catch (err) {
      updateMessage(err.message);
    }
  };

  if (loading) {
    return <Loader message="Preparing Team Data..." />;
  }

  return (
    <main className="main-style">
      {teams.map((team, index) => {
        const team_id = team.url.split("/").filter((part) => part).pop();
        return (
          <div key={team_id} className="card-style">
            <button 
              className="delete-button" 
              onClick={() => handleDelete(team_id)}
            >
                <span className="material-symbols-outlined">
                    delete
                </span>
            </button>
            <div className="index-number">{index + 1}</div>
            <Link to={`/team/${team_id}`}>
              <h2 className="card-name">{team.name}</h2>
              <p>
                <strong>Party Leader:</strong> {team.user}
              </p>
              <p>
                <strong>Party Size:</strong> {team.members_amount}
              </p>
              <p>
                <strong>Level:</strong> {team.level}
              </p>
            </Link>
          </div>
        );
      })}
      <button className="floating-button" onClick={toggleModal}>
        +
      </button>
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {message && <p className="error-message">{message}</p>}
            <h1>New Party</h1>
            <form onSubmit={handleSubmit} className="signin-form">
              <div className="form-group">
                <label htmlFor="username">Leader</label>
                <input
                  type="text"
                  id="username"
                  value={localStorage.getItem("username")}
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  name="name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="members_amount">Size</label>
                <div className="input-container">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange({
                        target: {
                          name: "members_amount",
                          value: Math.max(formData.members_amount - 1, 1),
                        },
                      })
                    }
                    className="btn-decrement"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="members_amount"
                    value={formData.members_amount}
                    name="members_amount"
                    onChange={handleChange}
                    required
                    min="1"
                    max="5"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleChange({
                        target: {
                          name: "members_amount",
                          value: Math.min(formData.members_amount + 1, 5),
                        },
                      })
                    }
                    className="btn-increment"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="level">Members</label>
                <input
                  type="text"
                  id="level"
                  value={formData.level}
                  name="level"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-actions create-button">
                <button type="submit">Create Party</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default TeamList;
