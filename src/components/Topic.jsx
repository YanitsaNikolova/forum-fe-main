import "./Topic.css";
import ApiURL from "../Global/Api";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

function Topic() {
  const [topics, setTopics] = useState();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [newComments, setNewComments] = useState({});
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cookies = new Cookies();
  const id = urlParams.get("id");
  const [currentPage, setCurrentPage] = useState(
    parseInt(urlParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopic(id);
    fetchPosts(id);
  }, [id, currentPage]);

  const fetchTopic = async (id) => {
    try {
      const response = await fetch(`${ApiURL}topics/${id}`);
      if (!response.ok) throw new Error("Failed to fetch topic");
      const data = await response.json();
      setTopics(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const fetchPosts = async (id) => {
    try {
      const response = await fetch(
        `${ApiURL}posts/topic/${id}?page=${currentPage - 1}&pageSize=10`
      );
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data || []);
      setTotalPages(Math.ceil(data.length / 10));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const changeText = (event) => {
    setText(event.target.value);
  };

  const post = async () => {
    try {
      const response = await fetch(`${ApiURL}posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          username: cookies.get("login"),
          topicId: id,
        }),
      });
      if (!response.ok) throw new Error("Failed to create post");
      await response.json();
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const addComment = async (postId) => {
    if (!newComments[postId]?.trim()) return;

    try {
      const response = await fetch(`${ApiURL}comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newComments[postId],
          userId: cookies.get("userId"),
          postId: postId,
        }),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      fetchPosts(id);
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    items.push(
      <li
        key="prev"
        className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}
      >
        <a
          className="page-link"
          href={`/Topic?id=${id}&page=${currentPage - 1}`}
        >
          <i className="fas fa-chevron-left"></i>
        </a>
      </li>
    );

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);
    if (endPage - startPage < 2) {
      startPage = Math.max(1, endPage - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <a className="page-link" href={`/Topic?id=${id}&page=${i}`}>
            {i}
          </a>
        </li>
      );
    }

    items.push(
      <li
        key="next"
        className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}
      >
        <a
          className="page-link"
          href={`/Topic?id=${id}&page=${currentPage + 1}`}
        >
          <i className="fas fa-chevron-right"></i>
        </a>
      </li>
    );

    return items;
  };

  const canEditTopic = (topicUserId) => {
    const currentUserId = cookies.get('userId');
    const userRole = cookies.get('role');
    return userRole === 'admin' || topicUserId === currentUserId;
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!topics || !posts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="forum-container">
      <div className="forum-header">
        <h1 className="forum-title">Форум дискусии</h1>
        <a href="/NewTopic" className="create-topic-btn">
          <i className="fas fa-plus"></i> Нова тема
        </a>
      </div>
      <div className="topic-card">
        <div className="topic-card-content">
          <h2 className="topic-title">{topics?.title}</h2>
          <div className="topic-footer">
            <div className="topic-stats">
              <span className="views-count">
                <i className="fas fa-eye"></i>
              </span>
              <span className="creator-info">
                <i className="fas fa-user"></i> създадено от {topics?.username} на {new Date(topics?.created).toLocaleDateString()}
              </span>
            </div>
          </div>
          {canEditTopic(topics?.userId) && (
            <div className="topic-actions">
              <a href={`/EditTopic?id=${id}`} className="edit-button">
                <i className="fas fa-edit"></i> Редактирай
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="posts-section">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-card-content">
              <h3 className="post-title">{post.title}</h3>
              <div className="post-footer">
                <div className="post-stats">
                  <span className="creator-info">
                    <i className="fas fa-user"></i> създадено от {post.username} на {new Date(post.created).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="post-text">{post.text}</div>
              <div className="comments-section">
                <div className="post-label">Пост</div>
                {post.comments?.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-content">
                      <div className="comment-text">{comment.text}</div>
                      <div className="comment-meta">
                        <span className="comment-author">
                          <i className="fas fa-user"></i> коментирано от {comment.username}
                        </span>
                        <span className="comment-date">
                          <i className="fas fa-clock"></i> {new Date(comment.created).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="comment-label">Коментар</div>
                  </div>
                ))}
                <div className="add-comment-form">
                  <textarea
                    className="comment-input post-input"
                    value={newComments[post.id] || ""}
                    onChange={(e) =>
                      setNewComments((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    placeholder="Добавете коментар..."
                  />
                  <button
                    className="add-comment-btn"
                    onClick={() => addComment(post.id)}
                  >
                    Публикувай
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="post-form-card">
        <textarea
          className="post-input"
          onChange={changeText}
          value={text}
          placeholder="Създай нов post"
        />
        <button className="submit-post-btn" onClick={post}>
          <i className="fas fa-paper-plane"></i> Публикувай
        </button>
      </div>
      <div className="pagination-container">
        <nav aria-label="Page navigation">
          <ul className="pagination">{renderPaginationItems()}</ul>
        </nav>
      </div>
    </div>
  );
}

export default Topic;
