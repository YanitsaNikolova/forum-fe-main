import './Topic.css'
import ApiURL from "../Global/Api";
import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie';

function EditTopic(){
    const [topics, setTopics] = useState();
    const [text, setText] = useState("");
    const [userid, setUserId] = useState("");
    const cookies = new Cookies();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    
    useEffect(() => {
        // Проверка за логин при зареждане на компонента
        if(!cookies.get('login') || !cookies.get('role')){
            window.location.href = "/Login";
            return;
        }

        fetchTopic(id);
    }, [id]);

    const fetchTopic = async (id) => {
        try {
            const response = await fetch(ApiURL+"topics/"+id);
            if (!response.ok) {
                throw new Error("Failed to fetch topic");
            }
            const data = await response.json();
            
            // Проверка за права за редактиране
            const userId = cookies.get('userId');
            const role = cookies.get('role');
            if(data.userId !== userId && role === "user") {
                window.location.href = "/Topics";
                return;
            }

            setTopics(data);
            setText(data.title);
            setUserId(data.userId);
        } catch (err) {
            console.error(err);
            alert("Възникна грешка при зареждането на темата");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(ApiURL+"topics/"+id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "title": text,
                    "userId": userid
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update topic");
            }

            await response.json();
            window.location.href = "/Topics";
        } catch (err) {
            console.error(err);
            alert("Възникна грешка при обновяването на темата");
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-xs-12 mb-2">									
                    <div className="form-group">
                        <textarea 
                            className="form-input" 
                            onChange={(e) => setText(e.target.value)} 
                            value={text}  
                            required 
                            placeholder="Topic Title"
                        />
                    </div>
                </div>
                <div className="col-xs-12 text-center"> {/* Center the button */}
                    {/* Add btn-small class */}
                    <button 
                        className="btn btn-small btn-primary"
                        onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
export default EditTopic