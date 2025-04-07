/*
MEJORAS:
1) mostrar mensaje cuando los inputs esten vacios
2) Validar el tipo de valor que se envia
3) Si no se guarda, mandar mensaje de erro visible para el cliente
*/

export function FetchAdd(url, data, onSuccess) {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(newData => {
            if (onSuccess) {
                onSuccess(newData, { message: "Exito" });
            }
        })
        .catch(error => {
            console.error("Error al registar datos:", error);
        });
};
