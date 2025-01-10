import { useState, useEffect } from 'react';
import * as teamService from '../../services/teamService';
import { useParams } from 'react-router-dom';
import { championPool } from '../../public/champions';
import Loader from '../../public/Loader/Loader';
import './styles.css';

const roles = ["Top", "Jungle", "Mid", "ADC", "Support"];

const TeamComp = (props) => {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [champs , setChamps] = useState(championPool);
    const [selectedChamps, setSelectedChamps] = useState([]);

    useEffect(() => {
        const fetchTeam = async () => {
          const teamData = await teamService.show(teamId);
          setTeam(teamData);
        };
        fetchTeam();
    }, [teamId]);

    const getRandomRole = () => {
        return roles[Math.floor(Math.random() * roles.length)];
    };

    const randomizeChamps = () => {
        const selected = [];
        const championsArray = Object.values(champs.data);
        let availableRoles = [...roles];
    
        while (selected.length < team.members_amount) {
            const randomChamp = championsArray[Math.floor(Math.random() * championsArray.length)];
            const randomRoleIndex = Math.floor(Math.random() * availableRoles.length);
            const randomRole = availableRoles.splice(randomRoleIndex, 1)[0];
    
            selected.push({ ...randomChamp, role: randomRole });
        }
        setSelectedChamps(selected);
    };
    

    if (!champs || !team) 
        return <Loader message="Preparing Team Data..." />;

    return (
        <main style={{marginTop: "120px"}}>
          <header>
            <h1>{team.name.toUpperCase()}</h1>
            <h1>{team.members_amount}</h1>
            <p style={{color: "white"}}>Party Size</p>
          </header>
          <button onClick={randomizeChamps}>Randomize Champions</button>
          <section>
            <h2>Rolled Champions</h2>
            <div className="selected-champs">
                {selectedChamps.map((champ, index) => (
                    <div className="champ-card" key={index}>
                        <img 
                            src={`http://ddragon.leagueoflegends.com/cdn/${champs.version}/img/champion/${champ.image.full}`} 
                            alt={champ.name} 
                        />
                        <p>{champ.name}</p>
                        <p>{champ.title}</p>
                        <p><strong>Role:</strong> {champ.role}</p>
                    </div>
                ))}
            </div>
          </section>
        </main>
    );
};

export default TeamComp;
