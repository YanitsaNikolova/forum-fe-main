import { Link } from "react-router-dom"

function Menu(){
    return  <div className="bg-light">
                <div className="container bg-light">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <a className="navbar-brand" href="/">
                        <img src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" width="30" height="30" alt=""/>
                        </a>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/Login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/Register">Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/Topics">Topics</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/NewTopic">New Topic</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/AdminPanel">Admin Panel</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
}
export default Menu