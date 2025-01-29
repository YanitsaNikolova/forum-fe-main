import { Link } from "react-router-dom"
import { useState } from "react"
import './Register.css'
import ApiURL from '../Global/Api'
import Cookies from 'universal-cookie';

function Register(){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const cookies = new Cookies();
    if(cookies.get('login'))
        window.location.href = "/Topics";
    const register = () => {
        if(password !== confirmPassword) {
            alert("Паролите не съвпадат");
            return;
        }
        fetch(ApiURL+"users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                name: name,
                role: "user"
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
            if(data && data.id){ // Проверяваме дали имаме успешен отговор с id
                cookies.set('login', username, { path: '/' });
                cookies.set('userId', data.id, { path: '/' });
                window.location.href = "/Topics";
            }
            else {
                alert("Грешка при регистрация");
            }
        })
        .catch(err => {
            console.error("Error:", err); // За дебъгване
            alert("Грешка при регистрация");
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
    const changeEmail = event => {
        const newValue =  event.target.value
        setEmail(newValue)
    }
    const changeConfirmPassword = event => {
        const newValue =  event.target.value
        setConfirmPassword(newValue)
    }
    const changeName = event => {
        const newValue =  event.target.value
        setName(newValue)
    }
    return (
        <div className="register-container">
            <div className="register-wrapper">
                <div className="register-card">
                    <div className="register-card-content">
                        <h2 className="register-title">Регистрация</h2>
                        <p className="register-subtitle">Създайте нов акаунт</p>
                        <div className="register-form">
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
                                <i className="fas fa-envelope"></i>
                                <input 
                                    type="email" 
                                    className="form-input"
                                    placeholder="Имейл"
                                    onChange={changeEmail} 
                                    value={email}
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

                            <div className="form-group">
                                <i className="fas fa-lock"></i>
                                <input 
                                    type="password" 
                                    className="form-input"
                                    placeholder="Потвърдете паролата"
                                    onChange={changeConfirmPassword} 
                                    value={confirmPassword}
                                />
                            </div>

                            <div className="form-group">
                                <i className="fas fa-user"></i>
                                <input 
                                    type="text" 
                                    className="form-input"
                                    placeholder="Име"
                                    onChange={changeName} 
                                    value={name}
                                />
                            </div>

                            <button 
                                onClick={register}
                                className="register-button"
                            >
                                Регистрация
                            </button>

                            <div className="register-footer">
                                <p>
                                    Вече имате акаунт? 
                                    <Link to="/Login" className="login-link">
                                        Вход
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

export default Register