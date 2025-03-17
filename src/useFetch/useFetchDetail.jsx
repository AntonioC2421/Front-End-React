import { useState, useEffect } from "react";

export function useFetchDetail(url) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return; // Evita ejecutar si no hay URL válida

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener los datos");
                }
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => setError(error.message));
    }, [url]);

    return { data, error };
}
