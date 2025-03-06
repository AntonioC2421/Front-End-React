import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="ListOption">
                <li>
                    <Link className="option" to="/">Home</Link>
                </li>
                <li>
                <Link className="option" to="/profes">Profesores</Link>
                </li>
                <li>
                <Link className="option" to="/alumnos">Alumnos</Link>
                </li>
                <li>
                <Link className="option" to="/matriculas">Matriculas</Link>
                </li>
                <li>
                <Link className="option" to="/cursos">Cursos</Link>
                </li>
            </ul>
        </nav>
    );
};
