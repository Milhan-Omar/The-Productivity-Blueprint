import { useCallback } from 'react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

const Todo = () => {
  const { user, logOut } = useContext(UserContext);
  const navigate = useNavigate();
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  const updateStatus = (id, status) => {
    fetch(`http://localhost:9292/todos/update/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: !status,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        setTodos((prev) => [
          ...prev.map((todo) =>
            todo.id === id ? { ...todo, status: !todo.status } : todo
          ),
        ]);
      });
  };

  const deleteTodo = (id) => {
    fetch(`http://localhost:9292/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        setTodos((prev) => [...prev.filter((todo) => todo.id !== id)]);
      });
  };

  const addTodo = (e) => {
    e.preventDefault();
    fetch('http://localhost:9292/todos/create', {
      method: 'POST',
      body: JSON.stringify({
        description: task,
        status: false,
        user_id: user.id,
        due: new Date(),
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setTodos((prev) => [...prev, json]);
        setTask('');
      });
  };

  const getUserTodos = useCallback(() => {
    fetch(`http://localhost:9292/todos/user/${user?.id}`)
      .then((response) => response.json())
      .then((json) => {
        setTodos(json);
      });
  }, [user?.id]);

  useEffect(() => {
    if (!user) navigate('/login');
    else getUserTodos();
  }, [getUserTodos, navigate, user]);

  return (
    <>
      <button
        className="btn"
        style={{ position: 'absolute', top: 50, right: 50 }}
        onClick={logOut}
      >
        Logout
      </button>
      <div
        style={{
          marginTop: '50px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1>To do List</h1>
        <h2 style={{ marginTop: '10px', display: 'block' }}>{user?.name}</h2>
      </div>
      <form onSubmit={addTodo}>
        <input
          value={task}
          type="text"
          required
          className="todo-input"
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="todo-button">
          <i className="fas fa-plus-square"></i>
        </button>
      </form>
      <div className="todo-container">
        <ul className="todo-list">
          {todos?.map((todo) => (
            <div
              key={todo.id}
              className={`todo ${todo?.status && 'done'}`}
              id={todo.id}
            >
              <li className="todo-item">{todo?.description}</li>
              <button
                className="complete-btn"
                onClick={() => updateStatus(todo?.id, todo?.status)}
              >
                <i className="fas fa-check"></i>
              </button>
              <button
                className="trash-btn"
                onClick={() => deleteTodo(todo?.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Todo;
