import React, { useEffect, useState } from "react";
import { useFecth } from "../../useFetch/useFetch";
import { DeleteRegister } from "../../useFetch/useFetchDelete";
import { useFetchChange } from "../../useFetch/useFetchChange";
import { FetchAdd } from "../../useFetch/useFetchAdd";
import { useNavigate } from 'react-router-dom';
import { ValidateData } from "../../utils/ValidateData";

const Alumnos = () => {
  //El proceso de la peticion desde useFecth.jsx
  //DATA: devuelve los datos optenidos de la API 
  //Loading: Mientras carga la pedicion
  //error: el error que se produce
  //handleCancelRequest: para cancelar la pedicion 
  const { data, loading, error, handleCancelRequest } = useFecth("http://localhost:5000/api/escuela/alumnos");
  const categoria = "alumnos";
  const [alumnos, setAlumnos] = useState([]); //todos los valores de alumnos

  const [editId, setEditId] = useState(null); //Activar/desactivar el modo editor
  const [editedData, setEditedData] = useState({}); // Datos editados
  const { updateData } = useFetchChange(); //Actualizar datos

  const navigate = useNavigate(); //llevar el id a DetailRegister.jsx

  const [createAlumno, setcreateAlumno] = useState(false); //Modo ADD
  const [createData, setcreateData] = useState({}); //Los datos que se van a crear
  const [message, setMessage] = useState(""); // Estado para el mensaje

  const [errorMessage, setErrorMessage] = useState("");
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
    const { messageError, data, success } = ValidateData(createData, categoria);

    if (success) {
      const url = `http://localhost:5000/api/escuela/alumnos/add`;
      FetchAdd(url, data, (newAlumno) => {

        setAlumnos((prevAlumnos) => [...prevAlumnos, newAlumno]);  // Agregar los nuevos datos para mostrarlos
        setcreateAlumno(false);  // Salir del modo ADD
        setcreateData({});  // Resetear los datos en los inputs
        setMessage("Alumno guardado exitosamente"); // Mostrar mensaje de éxito

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

  //DELETE
  const DataDelete = (id) => {
    // Mostrar confirmación antes de eliminar
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este registro?");
    if (confirmDelete) {
      const url = `http://localhost:5000/api/escuela/alumnos/delete/${id}`;

      DeleteRegister(url, () => {
        setAlumnos((prevAlumnos) => prevAlumnos.filter(alum => alum.id !== id)); //filtar para no volver a mostar el id eliminado
        setMessage("Alumno eliminado exitosamente");

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

  // Update 
  const DataChange = (id) => {
    setEditId(id);
    const alumnoSeleccionado = alumnos.find(alum => alum.id === id); //obtener los datos del id seleccionado
    setEditedData({ ...alumnoSeleccionado });
  };

  const handleInputChange = (e, field) => { //obtiene el valor del imput
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const saveChanges = () => { //guardar los cambios

    // Campos a validar
    const requiredFields = ['name', 'last_name', 'email'];

    // Comprobar si alguno de los campos está vacío o contiene solo espacios
    const isEmpty = requiredFields.some(field => !editedData[field] || editedData[field].trim() === "");

    if (isEmpty) {
      setErrorMessage("Por favor, rellene todos los campos.");

      setTimeout(() => {
        setErrorMessage(""); // Ocultar mensaje después de 1.5 segundos
      }, 1500);
      return; // No continuar con la actualización
    }

    const url = `http://localhost:5000/api/escuela/alumnos/update/${editId}`;


    const { messageError, data, success } = ValidateData(editedData, categoria);

    if (success) {
      updateData(url, data, (updatedAlumno) => {
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
        setMessage("Alumno editado exitosamente");

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
            ✖ Cancelar Solicitud API
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
                        type="email"
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
                        <button onClick={() => DataChange(alumno.id)} className="btn btn-warning btn-md">
                          <i className="bi bi-pencil"></i>
                        </button>
                      </td>
                      <td>
                        <button onClick={() => DataDelete(alumno.id)} className="btn btn-danger btn-md">
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                      <td>
                        <button onClick={() => Detail("alumno", alumno.id)} className="btn btn-info btn-md" ><i className="bi bi-card-heading"></i></button>
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
      {/* Mensajes de éxito o error */}
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
      {
        !loading && !error && alumnos?.length === 0 && (
          <p className="alert alert-warning">⚠ No hay alumnos registrados.</p>
        )
      }
    </div>
  );
};

export default Alumnos;