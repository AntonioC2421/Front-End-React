import React, { useState, useEffect } from "react";
import { useFecth } from "../../useFetch/useFetch";
import { DeleteRegister } from "../../useFetch/useFetchDelete";

const Profesores = () => {
  const [profesores, setProfesores] = useState([]);
  const { data, loading, error, handleCancelRequest } = useFecth("http://localhost:5000/api/escuela/profesores");

  useEffect(() => {
    if (data) {
      setProfesores(data); // Actualiza el estado de los profesores cuando la data cambia
    }
  }, [data]);

  const DataDelete = (id) => {
    // Mostrar confirmación antes de eliminar
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este registro?");
    if (confirmDelete) {
      const url = `http://localhost:5000/api/escuela/profesores/delete/${id}`;
      
      DeleteRegister(url, () => {
        // Actualizar el estado para eliminar el profesor de la lista
        setProfesores((prevProfesores) => prevProfesores.filter(profe => profe.id !== id));
      });
    }
  };

  return (
    <div className="container py-3">
      <header className="HeaderSeccion">
        <h2 className="titleTable">Lista de Profesores</h2>
        <div className="ButtonGroup">
          <button
            className="btn btn-danger"
            onClick={handleCancelRequest}
            aria-label="Cancelar petición"
          >
            ✖ Cancelar
          </button>
          <button
            className="btn btn-success"
            onClick={handleCancelRequest}
            aria-label="Cancelar petición"
          >
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
                  <td>{profe.name}</td>
                  <td>{profe.last_name}</td>
                  <td>{profe.email}</td>
                  <td>
                    <button className="btn btn-warning btn-sm">
                      <i className="bi bi-pencil"></i>
                    </button>
                  </td>
                  <td>
                    <button id="BtnDelteId" onClick={() => DataDelete(profe.id)} className="btn btn-danger btn-sm">
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-info btn-sm">
                      <i className="bi bi-card-heading"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && profesores?.length === 0 && (
        <p className="alert alert-warning">⚠ No hay alumnos registrados.</p>
      )}
    </div>
  );
};

export default Profesores;