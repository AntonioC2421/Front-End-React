/*
mejoras:
1) Mostrar mensajes de exito o error visible para el cliente
2) mensajes de inputs vacios
*/

import React, { useEffect, useState } from "react";
import { useFecth } from "../../useFetch/useFetch";
import { DeleteRegister } from "../../useFetch/useFetchDelete";
import { useFetchChange } from "../../useFetch/useFetchChange";
import { FetchAdd } from "../../useFetch/useFetchAdd";
import { useNavigate } from 'react-router-dom';

const Alumnos = () => {
    //El proceso de la peticion desde useFecth.jsx
    //DATA: devuelve los datos optenidos de la API 
    //Loading: Mientras carga la pedicion
    //error: el error que se produce
    //handleCancelRequest: para cancelar la pedicion 
    const { data, loading, error, handleCancelRequest } = useFecth("http://localhost:5000/api/escuela/alumnos");

    const [alumnos, setAlumnos] = useState([]); //todos los valores de alumnos

    const [editId, setEditId] = useState(null); //Activar/desactivar el modo editor
    const [editedData, setEditedData] = useState({}); // Datos editados
    const { updateData } = useFetchChange(); //Actualizar datos

    const navigate = useNavigate(); //llevar el id a DetailRegister.jsx

    const [createAlumno, setcreateAlumno] = useState(false); //Modo ADD
    const [createData, setcreateData] = useState({}); //Los datos que se van a crear

    //cada vez que se cambie los datos, se actualice todos los valores
    useEffect(() => {
        if (data) {
            setAlumnos(data)
        }
    }, [data]);

    //CREATE
    const ModeAdd = () => {
        setcreateAlumno(true);
    };

    const handleFetchAdd = () => {
        const url = `http://localhost:5000/api/escuela/alumnos/add`;
        
        FetchAdd(url, createData, (newAlumno) => {
            if (newAlumno && newAlumno.id) {
                setAlumnos((prevAlumnos) => [...prevAlumnos, newAlumno]);  // Agregar los nuevos datos para mostrarlos
                setcreateAlumno(false);  // Salir del modo ADD
                setcreateData({});  // Resetear los datos en los inputs
            }
        });
    };

    
    //DELETE
    const DataDelete = (id) => {
        // Mostrar confirmación antes de eliminar
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este registro?");
        if (confirmDelete) {
            const url = `http://localhost:5000/api/escuela/alumnos/delete/${id}`;

            DeleteRegister(url, () => {
                setAlumnos((prevAlumnos) => prevAlumnos.filter(alum => alum.id !== id)); //filtar para no volver a mostar el id eliminado
            });
        }
    };

    // Update 
    const DataChange = (id) => {
        setEditId(id);
        const alumnoSeleccionado = alumnos.find(alum => alum.id === id); //obtener los datos del id seleccionado
        setEditedData({ ...alumnoSeleccionado }); // Cargar datos en el estado
    };

    const handleInputChange = (e, field) => { //obtiene el valor del imput
        setEditedData({ ...editedData, [field]: e.target.value });
    };

    const saveChanges = () => { //guardar los cambios
        const url = `http://localhost:5000/api/escuela/alumnos/update/${editId}`;

        updateData(url, editedData, (updatedAlumno) => {
            if (!updatedAlumno || !updatedAlumno.id) {
                console.error("Error: El servidor no devolvió el alumno actualizado correctamente.");
                return;
            }

            setAlumnos((prevAlumnos) =>
                prevAlumnos.map((alumno) =>
                    alumno.id === editId ? { ...alumno, ...updatedAlumno } : alumno
                )
            );
            setEditId(null);
        });
    };

    //Read 
    const Detail = (categoria, id) => {
        navigate(`/detail/${categoria}/${id}`);  // Redirige a la página de detalles con el ID en la URL
    };

    return (
        <div className="container py-3">
            <header className="HeaderSeccion">
                <h2 className="titleTable">Lista de Alumnos</h2>
                <div className="ButtonGroup">
                    <button className="btn btn-danger" onClick={handleCancelRequest} aria-label="Cancelar petición">
                        ✖ Cancelar
                    </button>
                    <button className="btn btn-success" onClick={ModeAdd} aria-label="Cancelar petición">
                        + Agregar registro
                    </button>
                </div>
            </header>

            <section>
                {loading && <p className="alert alert-info">⏳ Cargando...</p>}
                {error && <p className="alert alert-danger">❌ Error: {error}</p>}
            </section>

            {!loading && !error && alumnos?.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Apellido</th>
                                <th scope="col">Email</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Eliminar</th>
                                <th scope="col">Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnos.map((alumno) => (
                                <tr key={alumno.id}>
                                    <th scope="row">{alumno.id}</th>
                                    <td>
                                        {editId === alumno.id ? (
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={editedData.name || ""}
                                                onChange={(e) => handleInputChange(e, "name")}
                                            />
                                        ) : (
                                            alumno.name
                                        )}
                                    </td>
                                    <td>
                                        {editId === alumno.id ? (
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={editedData.last_name || ""}
                                                onChange={(e) => handleInputChange(e, "last_name")}
                                            />
                                        ) : (
                                            alumno.last_name
                                        )}
                                    </td>
                                    <td>
                                        {editId === alumno.id ? (
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={editedData.email || ""}
                                                onChange={(e) => handleInputChange(e, "email")}
                                            />
                                        ) : (
                                            alumno.email
                                        )}
                                    </td>
                                    {editId === alumno.id ? (
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
                                                <button onClick={() => DataChange(alumno.id)} className="btn btn-warning btn-sm">
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button onClick={() => DataDelete(alumno.id)} className="btn btn-danger btn-sm">
                                                    <i className="bi bi-trash3"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button onClick={() => Detail("alumno", alumno.id)} className="btn btn-info btn-sm" ><i className="bi bi-card-heading"></i></button>
                                            </td>
                                        </>
                                    )}
                                </tr>

                            ))}
                            
                            {createAlumno && (
                                <tr>
                                    <td>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Id"
                                            value={createData.id || ""}
                                            onChange={(e) => setcreateData({ ...createData, id: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Nombre"
                                            value={createData.name || ""}
                                            onChange={(e) => setcreateData({ ...createData, name: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Apellido"
                                            value={createData.last_name || ""}
                                            onChange={(e) => setcreateData({ ...createData, last_name: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            type="email"
                                            placeholder="Email"
                                            value={createData.email || ""}
                                            onChange={(e) => setcreateData({ ...createData, email: e.target.value })}
                                        />
                                    </td>
                                    <td colSpan="3">
                                        <div className="IcoChange">
                                            <button onClick={() => handleFetchAdd()} className="btn btn-success btn-sm mx-2">
                                                <i className="bi bi-plus-circle"></i> Guardar
                                            </button>
                                            <button onClick={() => {
                                                setcreateAlumno(false);
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
            {
                !loading && !error && alumnos?.length === 0 && (
                    <p className="alert alert-warning">⚠ No hay alumnos registrados.</p>
                )
            }
        </div>
    );
};

export default Alumnos;