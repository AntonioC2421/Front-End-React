/*
Mejoras:
1) Mensaje de exito o error visible para el cliente
2) validar los datos cambiados (su tipo)
*/

import { useState } from "react";

export function useFetchChange() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateData = async (url, newData, onSuccess) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newData),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el registro");
            }

            const result = await response.json();
            onSuccess(result); // Llamamos a la función para actualizar el estado
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { updateData, loading, error };
}
