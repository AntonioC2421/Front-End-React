import React from "react";
import { Route, Routes } from "react-router-dom";
import Profesores from "../components/Profesores/profesores";
import Alumnos from "../components/Alumnos/alumnos";
import Matriculas from "../components/Matriculas/matriculas";
import Cursos from "../components/Cursos/cursos";
import Home from "../layouts/Home/Home";
import DataDetail from "../components/DetailRegister/DetailRegister";

export const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profes" element={<Profesores />} />
            <Route path="/alumnos" element={<Alumnos />} />
            <Route path="/matriculas" element={<Matriculas />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/detail/:categoria/:id" element={<DataDetail/>}/>
        </Routes>
    );
};
