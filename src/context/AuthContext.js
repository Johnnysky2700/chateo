import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user from localStorage and then refresh from backend
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Fetch fresh data from backend to get latest edits
      fetch(`https://chat-backend-ten-chi.vercel.app/users?email=${parsedUser.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setCurrentUser(data[0]);
            localStorage.setItem('currentUser', JSON.stringify(data[0]));
          } else {
            setCurrentUser(parsedUser);
          }
        })
        .catch(() => setCurrentUser(parsedUser));
    }
  }, []);

  // Login using email (from OTP flow)
  const login = async (userData) => {
    try {
      // userData must contain at least email
      const email = userData.email;
      const res = await fetch(`https://chat-backend-ten-chi.vercel.app/users?email=${email}`);
      const data = await res.json();

      let user;
      if (data && data.length > 0) {
        user = data[0];
      } else {
        // Create new user if not exists
        const createRes = await fetch(`https://chat-backend-ten-chi.vercel.app/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        user = await createRes.json();
      }

      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
