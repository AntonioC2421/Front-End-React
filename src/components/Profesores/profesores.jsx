import React, { useState, useEffect } from "react";
import { useFecth } from "../../useFetch/useFetch";
import { DeleteRegister } from "../../useFetch/useFetchDelete";
import { FetchAdd } from "../../useFetch/useFetchAdd";
import { ValidateData } from "../../utils/ValidateData";
import { useFetchChange } from "../../useFetch/useFetchChange";
import { useNavigate } from 'react-router-dom';

const Profesores = () => {

  const { data, loading, error, handleCancelRequest } = useFecth(`http://localhost:5000/api/escuela/profesores`);

  const categoria = "profesores";

  const [profesores, setProfesores] = useState([]);

  //mensajes
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //ADD
  const [createProfesor, setcreateProfesor] = useState(false);
  const [createData, setcreateData] = useState({});

  //UPDATE
  const [editId, setEditId] = useState(null);
  const [editeData, setEditeData] = useState({});
  const { updateData } = useFetchChange();

  //Detalle
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setProfesores(data);
    }
  }, [data]);

  //ADD
  const ModeAdd = () => {
    setcreateProfesor(true);
  };

  const handleFetchAdd = () => {
    const { messageError, data, success } = ValidateData(createData, categoria);

    if (success) {
      const url = `http://localhost:5000/api/escuela/profesores/add`;
      FetchAdd(url, data, (newProfesor) => {
        setProfesores((prevProfesores) => [...prevProfesores, newProfesor]);

        setcreateProfesor(false);
        setcreateData({});
        setMessage("Profesor guardado exitosamente");

        setTimeout(() => {
          setMessage("");
        }, 1500);

      });
    } else {
      setErrorMessage(messageError);
      setTimeout(() => {
        setMessage("");
      }, 1500);
    }
  };

  //UPDATE
  const DataChange = (id) => {
    setEditId(id);

    const profesorSeleccionado = profesores.find(profe => profe.id === id);

    setEditeData({ ...profesorSeleccionado });
  };

  const handleInputChange = (e, field) => {
    setEditeData({ ...editeData, [field]: e.target.value });
  };

  const saveChanges = () => {
    const requiredFields = ['name', 'last_name', 'email'];

    const isEmpty = requiredFields.some(field => !editeData[field] || editeData[field].trim() === "");

    if (isEmpty) {
      setErrorMessage("Todos los campos son obligatorios");

      setTimeout(() => {
        setErrorMessage("");

      }, 1500);

      return;
    }

    const url = `http://localhost:5000/api/escuela/profesores/update/${editId}`;

    const { messageError, data, success } = ValidateData(editeData, categoria);

    if (success) {
      updateData(url, data, (updatedProfesor) => {
        if (!updatedProfesor || !updatedProfesor.id) {
          console.error("Error al actualizar al profesor, Error de servidor");
          return;
        }

        setProfesores((prevProfesores) =>
          prevProfesores.map((profe) =>
            profe.id === editId ?
              { ...profe, ...updatedProfesor } : profe
          )
        );

        setEditId(null);
        setMessage("Profesor editado correctamente");

        setTimeout(() => {
          setMessage("");
        }, 1500);
      });
    } else {
      setErrorMessage(messageError);

      setTimeout(() => {
        setMessage("")
      }, 1500);
    }
  }

  //Read 
  const Detail = (categoria, id) => {
    navigate(`/detail/${categoria}/${id}`);
  };

  //DELETE
  const DataDelete = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este registro?");

    if (confirmDelete) {
      const url = `http://localhost:5000/api/escuela/profesores/delete/${id}`;

      DeleteRegister(url, () => {
        setProfesores((prevProfesores) => prevProfesores.filter(profe => profe.id !== id));

        setMessage("Profesor eliminado exitosamente");

        setTimeout(() => {
          setMessage("");
        }, 1500);
      }, () => {

        setErrorMessage("Error en aliminación");

        setTimeout(() => {
          setErrorMessage("");
        }, 1500);
      });
    }
  };

  return (
    <div className="container py-3">
      <header className="HeaderSeccion">
        <h2 className="titleTable">Lista de Profesores</h2>
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

      {!loading && !error && profesores?.length > 0 && (
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
              {profesores.map((profe) => (
                <tr key={profe.id}>
                  <th scope="row">{profe.id}</th>

                  <td>{editId === profe.id ? (
                    <input type="text"
                      className="form-control"
                      value={editeData.name || ""}
                      onChange={(e) => handleInputChange(e, "name")}
                    />
                  ) : (
                    profe.name
                  )}
                  </td>

                  <td>{editId === profe.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editeData.last_name || ""}
                      onChange={(e) => handleInputChange(e, "last_name")}
                    />
                  ) : (
                    profe.last_name
                  )}
                  </td>

                  <td>{editId === profe.id ? (
                    <input type="email"
                      className="form-control"
                      value={editeData.email || ""}
                      onChange={(e) => handleInputChange(e, "email")} />
                  ) : (
                    profe.email
                  )}
                  </td>

                  {editId === profe.id ? (
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
                        <button onClick={() => DataChange(profe.id)} className="btn btn-warning btn-md">
                          <i className="bi bi-pencil"></i>
                        </button>
                      </td>
                      <td>
                        <button onClick={() => DataDelete(profe.id)} className="btn btn-danger btn-md">
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                      <td>
                        <button onClick={() => Detail("profesor", profe.id)} className="btn btn-info btn-md" ><i className="bi bi-card-heading"></i></button>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {createProfesor && (
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
                        setcreateProfesor(false);
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

      {!loading && !error && profesores?.length === 0 && (
        <p className="alert alert-warning">⚠ No hay alumnos registrados.</p>
      )}
    </div>
  );
};

export default Profesores;