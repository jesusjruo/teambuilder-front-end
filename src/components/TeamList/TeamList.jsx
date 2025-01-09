import { Link } from 'react-router-dom';

const TeamList = (props) => {
    return (
        <main className="main-style">
            {props.teams.map((team, index) => (
                <Link to={`${team.url}`}>
                    <div className="card-style">
                        <div className="index-number">{index + 1}</div>
                        <h2 className="card-name">{team.name}</h2>
                        <p><strong>Creator:</strong> {team.user}</p>
                        <p><strong>Champions assigned:</strong> {team.members_amount}</p>
                        <p><strong>Level:</strong> {team.level}</p>
                    </div>
                </Link>
            ))}
        </main>
    );
};

export default TeamList;

