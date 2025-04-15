import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFecth } from "../../useFetch/useFetch"; //obtener datos adicionales
import { useFetchDetail } from "../../useFetch/useFetchDetail"; // Solicitud Api detalles
import login from "../../assets/imagenes/imgLogin.webp";
import school from "../../assets/imagenes/InsigniaColegio.webp";
import "./DetailRegister.css";

const DataDetail = () => {
    const { id, categoria } = useParams();
    const [url, setUrl] = useState("");

    useEffect(() => {
        switch (categoria) {
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
    const { data: profesores } = useFecth("http://localhost:5000/api/escuela/profesores");
    const { data: cursos } = useFecth("http://localhost:5000/api/escuela/cursos");
    const { data: alumnos } = useFecth("http://localhost:5000/api/escuela/alumnos");

    if (error) return <p className="alert alert-danger">❌ Error: {error}</p>;
    if (!data) return <p className="alert alert-info">⏳ Cargando...</p>; // Muestra un mensaje mientras se cargan los datos

    return (
        <div className="container-fluid row g-0 ContentDetail">

            <div className="HeaderDetail col-lg-4 col-md-12 col-sm-12">
                {(categoria == "alumno" || categoria == "profesor") && (
                    <img src={login} alt="imgLogin" className="ImgLogin" />
                )}

                {(categoria == "matricula" || categoria == "curso") && (
                    <img src={school} alt="imgLogin" className="ImgLogin" />
                )}

                {data.name && (
                    <h5 className="TextDetail"> {data.name} {data.last_name} </h5>
                )}
            </div>

            <div className="BodyDetail col-lg-8 col-md-12 col-sm-12">
                {categoria && (
                    <div className="ItemDateList categoriaCard">
                        <i className="bi bi-tag"></i>
                        <p> <strong>Clasificación:</strong> {categoria.toUpperCase()}</p>
                    </div>
                )}

                {data.id && (
                    <div className="ItemDateList idCard">
                        <i className="bi bi-person-vcard"></i>
                        <p><strong>Código: </strong>{data.id}</p>
                    </div>
                )}

                {data.email && (
                    <div className="ItemDateList emailCard">
                        <i className="bi bi-envelope"></i>
                        <p><strong>Correo: </strong> {data.email}</p>
                    </div>
                )}

                {data.id_profesor && (
                    <div className="ItemDateList IdProfesorCard">
                        <i className="bi bi-person-badge"></i>
                        <p><strong>Profesor: </strong> {profesores?.find(profe => profe.id === data.id_profesor)?.name} {profesores?.find(profe => profe.id === data.id_profesor)?.last_name || "Desconocido"}</p>
                    </div>
                )}

                {data.curso_id && (
                    <div className="ItemDateList idCursoCard">
                        <i className="bi bi-book"></i>
                        <p><strong>Materia:</strong> {cursos?.find(curso => curso.id == data.curso_id)?.name || "Desconocido"}</p>
                    </div>
                )}

                {data.alumno_id && (
                    <div className="ItemDateList idAlumoCard">
                        <i className="bi bi-person"></i>
                        <p><strong>Alumno: </strong>{alumnos?.find(alumno => alumno.id == data.alumno_id)?.name} {alumnos?.find(alumno => alumno.id == data.alumno_id)?.last_name || "Desconocido"}</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default DataDetail;