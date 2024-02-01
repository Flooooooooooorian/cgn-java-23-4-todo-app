import {Todo} from "./Todo.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import TodoColumn from "./TodoColumn.tsx";
import {allPossibleTodos} from "./TodoStatus.ts";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./ProtectedRouteProps.tsx";

function App() {

    const [user, setUser] = useState<string>()
    const [todos, setTodos] = useState<Todo[]>()

    function fetchTodos() {
        axios.get("/api/todo")
            .then(response => {
                setTodos(response.data)
            })
    }

    const login = () => {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080' : window.location.origin

        window.open(host + '/oauth2/authorization/github', '_self')
    }

    const loadUser = () => {
        axios.get("/api/users/me")
            .then((response) => {
                setUser(response.data)
            })
    }

    const logout = () => {
        axios.post("/api/logout")
            .then(() => loadUser());
    }

    useEffect(() => {
        fetchTodos()
        loadUser()
    }, [])

    if (!todos) {
        return "Lade..."
    }

    return (
        <Routes>
            <Route element={<ProtectedRoute user={user} /> }>
                <Route path={"/"} element={<div className="page">
                    <h1>TODOs</h1>
                    <p>{user}</p>
                    <button onClick={login}>Login</button>
                    <button onClick={logout}>Logout</button>
                    {
                        allPossibleTodos.map(status => {
                            const filteredTodos = todos.filter(todo => todo.status === status)
                            return <TodoColumn
                                status={status}
                                todos={filteredTodos}
                                onTodoItemChange={fetchTodos}
                                key={status}
                            />
                        })
                    }
                </div>} />
            </Route>

            <Route path={"/login"} element={<button onClick={login}>Login</button>}/>
        </Routes>
    )
}

export default App
