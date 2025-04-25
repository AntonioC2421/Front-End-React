export function FetchAdd(url, data, onSuccess, onError) {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(async (response) => {
            const result = await response.json();

            if (response.ok) {
                if (onSuccess) onSuccess(result);
            } else {
                if (onError) onError(result.message || "Error desconocido del servidor.");
            }
        })
        .catch(error => {
            console.error("Error al registrar datos:", error);
            if (onError) onError("Error de red o el servidor no está disponible.");
        });
}