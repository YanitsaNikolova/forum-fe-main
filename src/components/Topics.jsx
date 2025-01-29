import Cookies from 'universal-cookie';
import ApiURL from "../Global/Api";
import { useState, useEffect } from 'react'

function Topics(){
    
  const [topics, setTopics] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const currentPage = parseInt(urlParams.get('page')) || 1;
  const cookies = new Cookies();
  if(cookies.get('login') == "" || !cookies.get('login')){
      window.location.href = "/Login";
  }
  var pageOne = {
      page : 1,
      active : false
  };
  var pageTwo = {
      page : 2,
      active : false
  };
  var pageThree = {
      page : 3,
      active : false
  };
  if(currentPage > 2){
      pageOne.page = currentPage - 1;
      pageTwo.page = currentPage;
      pageThree.page = Number(currentPage) + 1;
      pageTwo.active = true;
  }
  useEffect(() => {
      fetchTopics(currentPage);
    }, [currentPage]);
  const fetchTopics = async (page) => {
      try {
          const response = await fetch(`${ApiURL}topics?page=${page-1}&pageSize=3`);
          if (!response.ok) throw new Error("Failed to fetch topics");
          const data = await response.json();
          setTopics(data);
          const totalItems = parseInt(response.headers.get('X-Total-Count')) || data.length;
          setTotalPages(Math.ceil(totalItems / 3));
      } catch (err) {
          console.error(err);
      }
  };

  const canEditTopic = (topicUserId) => {
      const currentUserId = cookies.get('userId');
      const userRole = cookies.get('role');
      return userRole === 'admin' || topicUserId === currentUserId;
  };

  const renderPaginationItems = () => {
      const items = [];
      
      // Добавяме бутон "Предишна"
      items.push(
          <li key="prev" className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
              <a className="page-link" href={`/Topics?page=${currentPage - 1}`}>
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
              <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                  <a className="page-link" href={`/Topics?page=${i}`}>{i}</a>
              </li>
          );
      }

      items.push(
          <li key="next" className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
              <a className="page-link" href={`/Topics?page=${currentPage + 1}`}>
                  <i className="fas fa-chevron-right"></i>
              </a>
          </li>
      );

      return items;
  };

  return (
      <div className="forum-container">
          <div className="forum-header">
              <h1 className="forum-title">Форум дискусии</h1>
              <a href="/NewTopic" className="create-topic-btn">
                  <i className="fas fa-plus"></i> Нова тема
              </a>
          </div>

          <div className="topics-list">
              {topics.map(item => (
                  <div key={item.id} className="topic-card">
                      <div className="topic-card-content">
                          <h2 className="topic-title">
                              <a href={`/Topic?id=${item.id}`}>{item.title}</a>
                          </h2>
                          
                          <div className="topic-footer">
                              <div className="topic-stats">
                        
                                  <span className="creator-info">
                                      <i className="fas fa-user"></i> създадено от {item.username} на {new Date(item.created).toLocaleDateString()}
                                  </span>
                              </div>
                          </div>
                          
                          {canEditTopic(item.userId) && (
                              <div className="topic-actions">
                                  <a href={`/EditTopic?id=${item.id}`} className="edit-button">
                                      <i className="fas fa-edit"></i> Редактирай
                                  </a>
                              </div>
                          )}
                      </div>
                  </div>
              ))}
          </div>

          <div className="pagination-container">
              <nav aria-label="Page navigation">
                  <ul className="pagination">
                      {renderPaginationItems()}
                  </ul>
              </nav>
          </div>
      </div>
  );
}
export default Topics