export function DeleteRegister(url, onSuccess, onError) {
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
        return response.text();
    })
    .then(() => {
        onSuccess({"message":"Registro eliminado con éxito!"});
    })
    .catch((error) => {
        onError({"message": `Error: ${error}`});
    });
}
