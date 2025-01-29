import "./Topic.css";
import ApiURL from "../Global/Api";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

function EditPost() {
  const [text, setText] = useState("");
  const cookies = new Cookies();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var id = urlParams.get("id");
  var topicId = urlParams.get("topic");
  var username = "";
  var role = "";
  if (
    cookies.get("login") == "" ||
    !cookies.get("login") ||
    cookies.get("role") == "" ||
    !cookies.get("login")
  ) {
    window.location.href = "/Login";
  } else {
    username = cookies.get("login");
    role = cookies.get("role");
  }
  const changeText = (event) => {
    const newValue = event.target.value;
    setText(newValue);
  };

  useEffect(() => {
    fetchpost(id);
  }, [id]);
  const fetchpost = async (id) => {
    fetch(ApiURL + "post/topic/" + topicId)
      .then(function (response) {
        if (!response.ok) {
          alert("something went wrong!");
        }
        return response.json();
      })
      .then((data) => {
        let post = data.find(function (postData) {
          return postData.id == id;
        });
        if (post.username != username)
          if (role == "user") window.location.href = "/Topics";
        setText(post.text);
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Something went wrong while fetching the topic. Please try again later."
        );
      });
  };
  const setpost = () => {
    fetch(ApiURL + "posts/topic/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    })
      .then(function (response) {
        if (!response.ok) {
          alert("Нещо се обърка...");
        }
        return response.json();
      })
      .then((data) => {
        window.location.href = "/Topics";
      })
      .catch((err) => {
        console.log(err);
        alert("Нещо се обърка2...");
      });
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 mb-2">
            <div className="form-group">
              <textarea
                className="form-input"
                onChange={changeText}
                value={text}
                required=""
                placeholder="Topic Title"
              ></textarea>
            </div>
          </div>
          <a className="btn btn-primary pull-right" onClick={setpost}>
            submit
          </a>
        </div>
      </div>
    </>
  );
}
export default EditPost;
