const BASE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/api/team/`;
const url = 'https://league-of-legends-champions.p.rapidapi.com/champions/en-us?page=0&size=10&name=aatrox&role=fighter';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '1c42d2d857msh41bb54758ced339p10c40ajsn33db6d670188',
		'x-rapidapi-host': 'league-of-legends-champions.p.rapidapi.com'
	}
};

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const show = async (teamId) => {
  try {
    const res = await fetch(`${BASE_URL}${teamId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const create = async (team) => {
  try {
    const res = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(team),
    });
    const json = await res.json();

    if (res.ok) { 
      console.log('response: ' , json);
      if (json) {
        return json;
      }
    } else {
      throw new Error(json.detail || 'Signin failed');
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const remove = async (teamId) => {
  try {
    const res = await fetch(`${BASE_URL}${teamId}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export { index, show, create, remove };
