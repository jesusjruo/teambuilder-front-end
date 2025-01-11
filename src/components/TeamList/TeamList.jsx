import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as teamService from '../../services/teamService';
import Loader from '../../public/Loader/Loader';
import "./styles.css";

const TeamList = ({ teams, setTeams, loading }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    members_amount: 1,
    level: "",
  });
  const [editingTeamId, setEditingTeamId] = useState(null);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setIsEditing(false);
      setEditingTeamId(null);
      setFormData({
        name: "",
        members_amount: 1,
        level: "",
      });
    }
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
      setTeams((prevTeams) => {
        const updatedTeams = prevTeams.filter((team) => {
          const id = team.url.split("/").filter((part) => part).pop();
          return id !== teamId;
        });
        return updatedTeams;
      });
    } catch (err) {
      updateMessage("Failed to delete team.");
    }
  };

  const handleEdit = (team) => {
    setIsEditing(true);
    setEditingTeamId(team.url.split("/").filter((part) => part).pop());
    setFormData({
      name: team.name,
      members_amount: team.members_amount,
      level: team.level,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updatedTeam = await teamService.update(editingTeamId, formData);
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.url.split("/").filter((part) => part).pop() === editingTeamId
              ? updatedTeam
              : team
          )
        );
      } else {
        const newTeam = await teamService.create(formData);
        setTeams((prevTeams) => [...prevTeams, newTeam]);
      }
      setModalOpen(false);
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
              className="edit-button" 
              onClick={() => handleEdit(team)}
            >
                <span>Edit</span>
            </button>
            <button 
              className="delete-button" 
              onClick={() => handleDelete(team_id)}
            >
                <span className="material-symbols-outlined">
                    delete
                </span>
            </button>
            <Link to={`/team/${team_id}`}>
              <h2 className="card-name">{team.name}</h2>
              <p>
                <strong>Party Leader:</strong> {team.user}
              </p>
              <p>
                <strong>Party Size:</strong> {team.members_amount}
              </p>
              <p>
                <strong>Party Members:</strong> {team.level}
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
            <h1>{isEditing ? "Edit Party" : "New Party"}</h1>
            <br></br>
            <br></br>
            <form onSubmit={handleSubmit} className="signin-form">
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
                <button type="submit">
                  {isEditing ? "Update Party" : "Create Party"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default TeamList;
