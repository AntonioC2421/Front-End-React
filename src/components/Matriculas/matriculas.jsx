import React from "react";
import { useFecth } from "../../useFetch/useFetch";

const Matriculas = () => {

    const { data, loading, error, handleCancelRequest } = useFecth("http://localhost:5000/api/escuela/matriculas")

    //valores de los alumnos
    const { data: alumnos } = useFecth("http://localhost:5000/api/escuela/alumnos");

    //valores de cursos
    const { data:cursos } = useFecth("http://localhost:5000/api/escuela/cursos");

    return (
        <div className="container py-3">
            <header className="HeaderSeccion">
                <h2 className="titleTable">Lista de Matriculas</h2>
                <div className="ButtonGroup">
                    <button className="btn btn-danger"
                        onClick={handleCancelRequest}
                        aria-label="Cancelar petición">
                        ✖ Cancelar
                    </button>
                    <button className="btn btn-success"
                        onClick={handleCancelRequest}
                        aria-label="Cancelar petición">
                        + Agregar registro
                    </button>
                </div>
            </header>

            <section>
                {loading && <p className="alert alert-info">⏳ Cargando...</p>}
                {error && <p className="alert alert-danger">❌ Error: {error}</p>}
            </section>

            {!loading && !error && data?.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">ID Profesor</th>
                                <th scope="col">ID Alumno</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Eliminar</th>
                                <th scope="col">Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((matricula) => (
                                <tr key={matricula.id}>
                                    <th scope="row">{matricula.id}</th>
                                    <td>{cursos?.find(curso => curso.id === matricula.curso_id)?.name || "Desconocido"}</td>
                                    <td>{alumnos?.find(alumno => alumno.id === matricula.alumno_id)?.name || "Desconocido"}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm">
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger btn-sm">
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-info btn-sm" ><i class="bi bi-card-heading"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!loading && !error && data?.length === 0 && (
                <p className="alert alert-warning">⚠ No hay cursos registrados.</p>
            )}
        </div>
    );
};

export default Matriculas;