import Amplify, { Auth } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

import { useState, useEffect } from "react";

import "./App.css";

Amplify.configure({
  Auth: {
    userPoolId: process.env.REACT_APP_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,
  },
});

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState([]);

  const request = async (url, method = "GET", body = null) => {
    const session = await Auth.currentSession();
    const jwt = session.getIdToken().getJwtToken();
    const options = {
      method,
      headers: new Headers({
        Authorization: jwt,
      }),
    };
    if (body) options.body = JSON.stringify(body);
    return await fetch(url, options);
  };

  useEffect(() => {
    async function getTodos() {
      const res = await request(`${process.env.REACT_APP_API}/todo`, "GET");
      const data = await res.json();
      setTodos(JSON.parse(data.body));
    }

    getTodos();
  }, [setTodos, todos]);

  return (
    <>
      <div className="signout">
        <AmplifySignOut />
      </div>
      <div className="container">
        <main className="main">
          <h1 className="title">Add a Task</h1>
          <div className="newContainer">
            <form>
              <div>
                <label htmlFor="todo">Task</label>
                <textarea
                  value={task}
                  onChange={(e) => {
                    setTask(e.target.value);
                  }}
                  name="todo"
                  required
                  rows="3"
                />
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault;
                  request(`${process.env.REACT_APP_API}/todo`, "POST", {
                    task,
                  });
                  setTask("");
                }}
                type="button"
              >
                Add
              </button>
            </form>
          </div>
          {todos.map((todo) => (
            <div key={todo.id} className="newContainer">
              <div className="task">{todo.task}</div>
            </div>
          ))}
        </main>

        <footer className="footer">
          <a
            href="https://www.youtube.com/channel/UCvI5azOD4eDumpshr00EfIw"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Codú Community
          </a>
        </footer>
      </div>
    </>
  );
}

export default withAuthenticator(App);
