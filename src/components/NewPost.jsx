import './Post.css'
import ApiURL from "../Global/Api";
import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie';

function NewPost(){
    const [text, setText] = useState("");
    const cookies = new Cookies();
    var username = "";
    if(cookies.get('login') == "" || !cookies.get('login')){
        window.location.href = "/Login";
    }
    else{
        username = cookies.get('login');
    }
    
    const changeText = event => {
        const newValue =  event.target.value
        setText(newValue)
    } 
    
    const post = () => {
        fetch(ApiURL+"posts", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "title": text,
                "username": username
            })
        })
        .then(function(response) {
            if (!response.ok) {
                alert("Нещо се обърка...")
            }
            return response.json();
        })
        .then(data => {
            window.location.href = "/Posts";
        })
        .catch(err => {
            console.log(err);
            alert("Нещо се обърка...");
        })
    }

    return <><div className="container">
            <div className="row">
                <div className="col-xs-12 mb-2">									
                    <div className="form-group">
                        <textarea className="form-input" onChange={changeText} value={text} required="" placeholder="Post Title"></textarea>
                    </div>
                </div>
                <a className="btn btn-primary pull-right" onClick={post}>submit</a>
            </div>
        </div></>
}

export default NewPost 