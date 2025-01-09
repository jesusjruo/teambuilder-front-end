const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const user = JSON.parse(atob(token.split('.')[1]));
  return user;
};

const signup = async (formData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const json = await res.json();

    if (res.ok) {
      if (json.access) {
        localStorage.setItem('token', json.access);
        return json;
      }
    } else {
      if (json.username) {
        throw new Error(json.username.join(', '));
      }
      throw new Error(json.detail || 'Signup failed');
    }
  } catch (err) {
    throw new Error(err.message || 'An error occurred during sign-up');
  }
};

const signin = async (user) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const json = await res.json();

    if (res.ok) {  // Check for successful response status
      if (json.access) {
        localStorage.setItem('token', json.access);
        const user = JSON.parse(atob(json.access.split('.')[1]));
        return user;
      }
    } else {
      // Handle specific Django error response for sign-in
      throw new Error(json.detail || 'Signin failed');
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const signout = () => {
  localStorage.removeItem('token');
};

export { signup, signin, getUser, signout };
