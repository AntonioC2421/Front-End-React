/*
mejoras:
1) mensaje de exito o error visible para el cliente
*/
export function DeleteRegister(url, onSuccess) {
    console.log("URL PARA ELIMINAR:", url);

    fetch(url, {
        method: "DELETE", // Especificamos que es una petición DELETE
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.statusText}`);
        }
        return response.text(); // Convertimos la respuesta a texto
    })
    .then((data) => {
        console.log("Eliminado correctamente:", data);
        onSuccess();  // Llamamos al callback de éxito para eliminar el profesor de la tabla
        alert("Registro eliminado con éxito!");
    })
    .catch((error) => {
        console.error("Error eliminando:", error);
        alert("Hubo un error al eliminar el registro");
    });
}
