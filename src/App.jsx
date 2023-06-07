import { createContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Todo from './pages/Todo';

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const logOut = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logOut }}>
      <Routes>
        <Route path="/" element={<Todo />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
