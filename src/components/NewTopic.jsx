import './Topic.css'
import ApiURL from "../Global/Api";
import { useState } from 'react'
import Cookies from 'universal-cookie';

function NewTopic() {
    const [title, setTitle] = useState("");
    const cookies = new Cookies();
    
    if(cookies.get('login') == "" || !cookies.get('login')){
        window.location.href = "/Login";
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert("Моля въведете заглавие на темата");
            return;
        }

        try {
            const response = await fetch(ApiURL+"topics", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    userId: cookies.get('userId')
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create topic");
            }
            window.location.href = "/"; // Redirect to home or topic list page
        } catch (err) {
            console.error(err);
            alert("Грешка при създаване на темата: " + err.message);
        }
    };

    return (
        <div className="new-topic-container">
            <h2 className="new-topic-title">Създаване на нова тема</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="new-topic-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Заглавие на темата"
                />
                <button type="submit" className="new-topic-btn">
                    <i className="fas fa-paper-plane"></i> Създай
                </button>
            </form>
        </div>
    );
}

export default NewTopic;