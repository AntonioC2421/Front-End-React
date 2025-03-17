/*
mejoras:
1) Mejorar el HTML
*/

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetchDetail } from "../../useFetch/useFetchDetail";

const DataDetail = () => {
    const { id, categoria } = useParams();
    const [url, setUrl] = useState("");

    useEffect(() => {
        switch(categoria){
            case 'alumno':
                setUrl(`http://localhost:5000/api/escuela/alumnos/${id}`);
                break;
            case 'profesor':
                setUrl(`http://localhost:5000/api/escuela/profesores/${id}`);
                break;
            case 'curso':
                setUrl(`http://localhost:5000/api/escuela/cursos/${id}`);
                break;
            case 'matricula':
                setUrl(`http://localhost:5000/api/escuela/matriculas/${id}`);
                break;
            default:
                setUrl("");
        }
    }, [id, categoria]);

    const { data, error } = useFetchDetail(url);

    if (error) return <p className="alert alert-danger">❌ Error: {error}</p>;
    if (!data) return <p className="alert alert-info">⏳ Cargando...</p>; // Muestra un mensaje mientras se cargan los datos

    return (
        <div>
            <h2>Detalles del {categoria}</h2>
            <ul>
                <li><strong>ID {categoria}:</strong> {data.id}</li>
                {data.name && (
                    <li><strong>Nombre: {categoria}:</strong> {data.name}</li>
                )}

                {data.last_name && (
                    <li><strong>Apellido:</strong> {data.last_name}</li>
                )}
                {data.email && (
                    <li><strong>Email:</strong> {data.email}</li>
                )}

                {data.id_profesor && (
                    <li><strong>ID Profesor:</strong> {data.id_profesor}</li>
                )}

                {data.curso_id && (
                    <li><strong>ID Curso:</strong> {data.curso_id}</li>
                )}

                {data.alumno_id && (
                    <li><strong>ID Alumno:</strong> {data.alumno_id}</li>
                )}
            </ul>
        </div>
    );
};

export default DataDetail;
