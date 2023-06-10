import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }
  function handleSubmit(event) {
    event.preventDefault();
    fetch('http://localhost:9292/login', {
      method: 'PATCH',
      body: JSON.stringify(formData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.user) {
          sessionStorage.setItem('user', JSON.stringify(json.user));
          setUser(json.user);
          navigate('/');
        }
      });
  }

  useEffect(() => {
    if (user) navigate('/');
  }, [navigate, user]);

  return (
    <form onSubmit={handleSubmit} className="form">
      <h1>Login</h1>
      <div className="form_wrapper">
        <label style={{ flex: 1 }}>Name</label>
        <input
          style={{ flex: 4 }}
          type="text"
          name="name"
          className="input"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="form_wrapper">
        <label style={{ flex: 1 }}>Password</label>
        <input
          style={{ flex: 4 }}
          type="password"
          name="password"
          className="input"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button className="btn">Login</button>

      <p style={{ color: 'black', fontWeight: '300', marginTop: '30px' }}>
        Have no account?{' '}
        <span
          style={{
            color: 'blue',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          onClick={() => navigate('/signup')}
        >
          Sign up
        </span>
      </p>
    </form>
  );
};

export default Login;
