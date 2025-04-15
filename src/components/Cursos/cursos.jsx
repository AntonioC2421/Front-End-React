import React from "react";
import { useFecth } from "../../useFetch/useFetch";

const Cursos = () => {

    const { data, error, loading, handleCancelRequest } = useFecth("http://localhost:5000/api/escuela/cursos");

    //datos de profesores
    const { data: profesores } = useFecth("http://localhost:5000/api/escuela/profesores")

    return (
        <div className="container py-3">
            <header className="HeaderSeccion">
                <h2 className="titleTable">Lista de cursos</h2>
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
                                <th scope="col">Curso</th>
                                <th scope="col">Profesor</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Eliminar</th>
                                <th scope="col">Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((curso) => (
                                <tr key={curso.id}>
                                    <th scope="row">{curso.id}</th>
                                    <td>{curso.name}</td>
                                    <td>{profesores?.find(profesore => profesore.id === curso.id_profesor)?.name || "Desconocido"}</td>
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
                                        <button className="btn btn-info btn-sm" ><i className="bi bi-card-heading"></i></button>
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
    )
}

export default Cursos;