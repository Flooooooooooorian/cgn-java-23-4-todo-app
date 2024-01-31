import {Todo} from "./Todo.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import TodoColumn from "./TodoColumn.tsx";
import {allPossibleTodos} from "./TodoStatus.ts";

function App() {

    const [todos, setTodos] = useState<Todo[]>()

    function fetchTodos() {
        axios.get("/api/todo")
            .then(response => {
                setTodos(response.data)
            })
    }

    const login = () => {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080': window.location.origin

        window.open(host + '/oauth2/authorization/github', '_self')
    }

    const loadUser = () => {
        axios.get("/api/users/me")
            .then((response) => {
                console.log(response.data)
            })
    }

    useEffect(fetchTodos, [])

    if (!todos) {
        return "Lade..."
    }

    return (
        <>
            <div className="page">
                <h1>TODOs</h1>
                <button onClick={login}>Login</button>
                <button onClick={loadUser}>Me</button>
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
            </div>
        </>
    )
}

export default App
