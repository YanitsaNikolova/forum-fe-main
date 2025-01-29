import { Link } from "react-router-dom"
import { useState } from "react"
import './Login.css'
import ApiURL from '../Global/Api'
import Cookies from 'universal-cookie';

function Login(){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const cookies = new Cookies();
    if(cookies.get('login'))
        window.location.href = "/Topics";
    const login = () => {
        fetch(ApiURL+"users/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Server response:", data); // За дебъгване
            if(data && data.role){ // Проверяваме дали имаме успешен отговор с роля
                cookies.set('login', username, { path: '/' });
                cookies.set('userId', data.id, { path: '/' });
                cookies.set('role', data.role, { path: '/' });
                window.location.href = "/Topics";
            }
            else {
                alert("Грешна парола или потребителско име");
            }
        })
        .catch(err => {
            console.error("Error:", err); // За дебъгване
            alert("Грешна парола или потребителско име");
        })
    }
    const changeUsername = event => {
        const newValue =  event.target.value
        setUsername(newValue)
    } 
    const changePassword = event => {
        const newValue =  event.target.value
        setPassword(newValue)
    } 
    return (
        <div className="forum-container">
            <div className="login-wrapper">
                <div className="login-card">
                    <div className="login-card-content">
                        <h2 className="login-title">Добре дошли</h2>
                        <p className="login-subtitle">Влезте във вашия акаунт</p>
                        <div className="login-form">
                            <div className="form-group">
                                <i className="fas fa-user"></i>
                                <input 
                                    type="text" 
                                    className="form-input"
                                    placeholder="Потребителско име"
                                    onChange={changeUsername} 
                                    value={username}
                                />
                            </div>
                            
                            <div className="form-group">
                                <i className="fas fa-lock"></i>
                                <input 
                                    type="password" 
                                    className="form-input"
                                    placeholder="Парола"
                                    onChange={changePassword} 
                                    value={password}
                                />
                            </div>

                            <button 
                                onClick={login}
                                className="login-button"
                            >
                                Вход
                            </button>

                            <div className="login-footer">
                                <p>
                                    Нямате акаунт? 
                                    <Link to="/Register" className="register-link">
                                        Регистрирайте се
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login