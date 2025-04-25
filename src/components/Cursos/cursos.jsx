import React, { useEffect, useState } from "react";
import { useFecth } from "../../useFetch/useFetch";
import { FetchAdd } from "../../useFetch/useFetchAdd";
import { useFetchChange } from "../../useFetch/useFetchChange";
import { DeleteRegister } from "../../useFetch/useFetchDelete";
import { ValidateData } from "../../utils/ValidateData";
import { useNavigate } from "react-router-dom";

const Cursos = () => {
    const { data, error, loading, handleCancelRequest } = useFecth("http://localhost:5000/api/escuela/cursos");
    const categoria = "cursos";
    const [cursos, setCursos] = useState([]);

    //ADD
    const [createCursos, setcreateCursos] = useState(false);
    const [createData, setcreateData] = useState({});

    //CHANGE
    const [editId, setEditId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const { updateData } = useFetchChange();

    const navigate = useNavigate();

    //mensajes
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (data) {
            setCursos(data)
        }
    }, [data]);

    //modo create
    const ModeAdd = () => {
        setcreateCursos(true);
    };

    const handleFetchAdd = () => {
        const { messageError, data, success } = ValidateData(createData, categoria);
        
        if (success) {
            const url = `http://localhost:5000/api/escuela/cursos/add`;

            FetchAdd(url, data, (newCurso) => {
                setCursos((prevCurso) => [...prevCurso, newCurso]);
                setcreateCursos(false);
                setcreateData({});
                setMessage("Curso guardado exitosamente");

                setTimeout(() => {
                    setMessage("");
                }, 1500);
            });
        } else {
            setErrorMessage(messageError);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        }
    };

    //update
    const DataChange = (id) => {
        setEditId(id);
        const cursoSeleccionado = cursos.find(curso => curso.id === id);
        setEditedData({ ...cursoSeleccionado });
    };

    const handleInputChange = (e, field) => {
        setEditedData({ ...editedData, [field]: e.target.value });
    };

    const saveChanges = () => {
        const requiredFields = ["id", "id_profesor", "name"];
        const isEmpty = requiredFields.some(field => !editedData[field] || editedData[field] === "");

        if (isEmpty) {
            setErrorMessage("Por favor, rellene todos los campos.");

            setTimeout(() => {
                setErrorMessage("")
            }, 1500);
            return;
        }

        const url = `http://localhost:5000/api/escuela/cursos/update/${editId}`;
        const { messageError, data, success } = ValidateData(editedData, categoria);

        if (success) {
            updateData(url, data, (updatedCurso) => {
                if (!updatedCurso || !updatedCurso.id) {
                    console.error("Error: El servidor no devolvió el curso actualizado correctamente.");
                    return;
                }

                setCursos((prevCursos) => prevCursos.map((curso) => curso.id === editId ? { ...curso, ...updatedCurso } : curso));
                setEditId(null);
                setMessage("Curso editado corretamente");

                setTimeout(() => {
                    setMessage("");
                }, 1500);
            });
        } else {
            setErrorMessage(messageError);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        }
    };

    //Delete
    const DataDelete = (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este registro?");

        if (confirmDelete) {
            const url = `http://localhost:5000/api/escuela/cursos/delete/${id}`;

            DeleteRegister(url, () => {
                setCursos((prevCursos) => prevCursos.filter(curso => curso.id !== id));
                setMessage("Curso eliminado exitosamente");

                setTimeout(() => {
                    setMessage("");
                }, 1500);
            }, () => {
                setErrorMessage("Error en eliminación");
                setTimeout(() => {
                    setErrorMessage("");
                }, 1500);
            });
        }
    };

    //Read 
    const Detail = (categoria, id) => {
        navigate(`/detail/${categoria}/${id}`);
    };

    return (
        <div className="container py-3">
            <header className="HeaderSeccion">
                <h2 className="titleTable">Lista de cursos</h2>
                <div className="ButtonGroup">
                    <button className="btn btn-danger" onClick={handleCancelRequest} aria-label="Cancelar petición">
                        ✖ Cancelar
                    </button>
                    <button className="btn btn-success" onClick={ModeAdd} aria-label="Agregar registro">
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
                            {cursos.map((curso) => (
                                <tr key={curso.id}>
                                    <th scope="row">{curso.id}</th>
                                    <td>{editId === curso.id ? (
                                        <input type="text" className="form-control" value={editedData.name || ""} 
                                        onChange={(e) => handleInputChange(e, "name")} />
                                    ) : (
                                        curso.name
                                    )}
                                    </td>
                                    <td>{editId === curso.id ? (
                                        <input type="number" className="form-control" value={editedData.id_profesor || ""}
                                            onChange={(e) => handleInputChange(e, "id_profesor")} />
                                    ) : (
                                        curso.id_profesor
                                    )}
                                    </td>
                                    {editId === curso.id ? (
                                        <>
                                            <td colSpan="3">
                                                <div className="IcoChange">
                                                    <button onClick={saveChanges} className="btn btn-success btn-sm mx-2 mb-1">
                                                        <i className="bi bi-floppy2 mx-2"></i> Guardar
                                                    </button>
                                                    <button onClick={() => setEditId(null)} className="btn btn-secondary btn-sm mx-2 mb-1">
                                                        <i className="bi bi-x-square mx-2"></i> Cancelar
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>
                                                <button onClick={() => DataChange(curso.id)} className="btn btn-warning btn-md">
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button onClick={() => DataDelete(curso.id)} className="btn btn-danger btn-md">
                                                    <i className="bi bi-trash3"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button onClick={() => Detail("curso", curso.id)} className="btn btn-info btn-md" ><i className="bi bi-card-heading"></i></button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {createCursos && (
                                <tr>
                                    <td>
                                        <input type="number" className="form-control" placeholder="Id" value={createData.id || ""}
                                            onChange={(e) =>
                                                setcreateData({
                                                    ...createData,
                                                    id: parseInt(e.target.value) || "",
                                                })
                                            }/>
                                    </td>
                                    <td>
                                        <input type="text" className="form-control" placeholder="Nombre" value={createData.name || ""}
                                            onChange={(e) => setcreateData({ ...createData, name: e.target.value })} />
                                    </td>
                                    <td>
                                        <input type="number" className="form-control" placeholder="Id Profesor" value={createData.id_profesor || ""}
                                            onChange={(e) =>
                                                setcreateData({
                                                    ...createData,
                                                    id_profesor: parseInt(e.target.value) || "",
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
                                                setcreateCursos(false);
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
    )
}

export default Cursos;