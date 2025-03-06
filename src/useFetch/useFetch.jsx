import { useState, useEffect } from "react";

export function useFecth (url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [controller, setController] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        setController(abortController);

        setLoading(true);
        
        fetch(url, {signal: abortController.signal})
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => {
                if(error.name === "AbortError"){
                    console.log('Request cancelled');
                }
                setError(error)
            }) // manipular el error
            .finally(() => setLoading(false)); //cuando finalice la peticion
        return () => abortController.abort();
    }, []);

    const handleCancelRequest = () => {
        controller.abort();
        setError("Request cancelled")
    }

    return {data, loading, error, handleCancelRequest};
}