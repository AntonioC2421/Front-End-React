import React, { useState, useEffect } from "react";
import { useFecth } from "../../useFetch/useFetch";
import { ValidateData } from "../../utils/ValidateData";
import { FetchAdd } from "../../useFetch/useFetchAdd";
import { DeleteRegister } from "../../useFetch/useFetchDelete";

const Matriculas = () => {

    const { data, loading, error, handleCancelRequest } = useFecth("http://localhost:5000/api/escuela/matriculas");

    const categoria = "matriculas";
    const [matriculas, setMatriculas] = useState([]);

    //ADD
    const [createMatriculas, setcreateMatriculas] = useState(false);
    const [createData, setcreateData] = useState({});

    //mensajes
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (data) {
            setMatriculas(data)
        }
    }, [data]);

    //CREATE
    const ModeAdd = () => {
        setcreateMatriculas(true);
    };

    const handleFetchAdd = () => {
        const { messageError, data, success } = ValidateData(createData, categoria);
    
        if (success) {
            const url = `http://localhost:5000/api/escuela/matriculas/add`;
            FetchAdd(
                url,
                data,
                (newMatricula) => {
                    setMatriculas((prevMatricula) => [...prevMatricula, newMatricula]);
                    setcreateMatriculas(false);
                    setcreateData({});
                    setMessage("Matrícula guardada exitosamente");
    
                    setTimeout(() => {
                        setMessage("");
                    }, 1500);
                },
                (errorMsg) => {
                    setErrorMessage(errorMsg);
                    setTimeout(() => {
                        setErrorMessage("");
                    }, 3000);
                }
            );
        } else {
            setErrorMessage(messageError);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        }
    };
    

    //DELETE
    const DataDelete = (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este registro?");

        if (confirmDelete) {
            const url = `http://localhost:5000/api/escuela/matriculas/delete/${id}`;

            DeleteRegister(url, () => {

                setMatriculas((prevMatriculas) => prevMatriculas.filter(matri => matri.id !== id));

                setMessage("Matricula eliminado exitosamente");

                setTimeout(() => {
                    setMessage("");
                }, 1500);
            }, (error) => {
                setErrorMessage("Error en eliminación");
                setTimeout(() => {
                    setErrorMessage("");
                }, 1500);
            });
        }
    };
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
                        onClick={ModeAdd}
                        aria-label="Agregar registro">
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
                                <th scope="col">Alumno</th>
                                <th scope="col">Curso</th>
                                
                                <th scope="col">Editar</th>
                                <th scope="col">Eliminar</th>
                                <th scope="col">Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matriculas.map((matricula) => (
                                <tr key={matricula.id}>
                                    <th scope="row">{matricula.id}</th>
                                    <td>{matricula.alumno_id}</td>
                                    <td>{matricula.curso_id}</td>
                                    
                                    <td>
                                        <button className="btn btn-warning btn-md">
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => DataDelete(matricula.id)} className="btn btn-danger btn-md">
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-info btn-md" ><i className="bi bi-card-heading"></i></button>
                                    </td>
                                </tr>
                            ))}
                            {createMatriculas && (
                                <tr>
                                    <td>
                                        <input type="number"
                                            className="form-control"
                                            placeholder="Id"
                                            value={createData.id || ""}
                                            onChange={(e) => setcreateData({ ...createData, id: e.target.value })} />
                                    </td>
                                    <td>
                                        <input type="number"
                                            className="form-control"
                                            placeholder="Id Alumno"
                                            value={createData.alumno_id || ""}
                                            onChange={(e) =>
                                                setcreateData({
                                                  ...createData,
                                                  alumno_id: parseInt(e.target.value) || "",
                                                })
                                              }
                                               />
                                    </td>
                                    <td>
                                        <input type="number"
                                            className="form-control"
                                            placeholder="Id Curso"
                                            value={createData.curso_id || ""}
                                            onChange={(e) =>
                                                setcreateData({
                                                  ...createData,
                                                  curso_id: parseInt(e.target.value) || "",
                                                })
                                              }
                                               />

                                    </td>
                                    
                                    <td colSpan="3">
                                        <div className="IcoChange">
                                            <button onClick={() => handleFetchAdd()} className="btn btn-success btn-sm mx-2">
                                                <i className="bi bi-plus-circle"></i> Guardar
                                            </button>
                                            <button onClick={() => {
                                                setcreateMatriculas(false);
                                                setcreateData({});
                                            }} className="btn btn-secondary btn-sm mx-2">
                                                <i className="bi bi-x-square"></i> Cancelar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {message && (
                <div className="alert alert-info d-flex">
                    <i className="bi bi-check2-circle px-2"></i>{message}
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-danger d-flex">
                    <i className="bi bi-dash-circle px-2"></i>
                    {errorMessage}
                </div>
            )}
            {!loading && !error && data?.length === 0 && (
                <p className="alert alert-warning">⚠ No hay cursos registrados.</p>
            )}
        </div>
    );
};

export default Matriculas;