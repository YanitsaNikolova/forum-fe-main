import React, { useState, useEffect } from 'react';
import ApiURL from "../Global/Api";
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom'; // Replace useHistory with useNavigate
import './AdminPanel.css'; // Ensure this import is correctly placed

function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const history = useNavigate(); // Replace useHistory with useNavigate

    useEffect(() => {
        const cookies = new Cookies();
        const role = cookies.get('role');
        if (role !== 'admin') {
            setIsAdmin(false);
            setTimeout(() => {
                history('/topics');
            }, 5000);
        } else {
            setIsAdmin(true);
            fetchUsers(currentPage);
        }
    }, [currentPage, history]);

    const fetchUsers = async (page) => {
        try {
            const response = await fetch(`${ApiURL}users?page=${page - 1}&pageSize=10`);
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            console.log(data); // Debugging line to check the response data
            if (!Array.isArray(data)) throw new Error("Users data is not an array");
            setUsers(data);
            setTotalPages(Math.ceil(data.length / 10)); // Assuming total is the length of the array
        } catch (err) {
            console.error(err);
        }
    };

    const roleChange = async (user, newRole) => {
        try {
            const response = await fetch(`${ApiURL}users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": user.username,
                    "email": user.email,
                    "password": user.password,
                    "name": user.name,
                    "role": newRole
                })
            });
            if (!response.ok) throw new Error("Something went wrong!");
            await response.json();
            fetchUsers(currentPage);
        } catch (err) {
            console.error(err);
            alert("Something went wrong!");
        }
    };

    const handleRoleChange = (user, event) => {
        const newRole = event.target.value;
        roleChange(user, newRole);
    };

    const renderPaginationItems = () => {
        const items = [];
        items.push(
            <li key="prev" className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1}>
                    <i className="fas fa-chevron-left"></i>
                </button>
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
                    <button className="page-link" onClick={() => setCurrentPage(i)}>{i}</button>
                </li>
            );
        }

        items.push(
            <li key="next" className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>
                    <i className="fas fa-chevron-right"></i>
                </button>
            </li>
        );

        return items;
    };

    if (!isAdmin) {
        return (
            <div className="admin-panel" style={{ textAlign: 'center', marginTop: '20%' }}>
                <h2>Нямате достъп до този панел</h2>
                <p>Този панел е достъпен само за администратори.</p>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td>
                                <select value={user.role} onChange={(event) => handleRoleChange(user, event)}>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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

export default AdminPanel;