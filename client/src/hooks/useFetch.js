import { useState, useCallback } from "react";

export const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(
        async (url, method = "GET", body = null, headers = {}) => {
            try {
                setIsLoading(true);

                if (body) {
                    body = JSON.stringify(body);
                    headers["Content-Type"] = "application/json";
                }

                const response = await fetch(url, { method, body, headers });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Request was not completed"
                    );
                }

                return data;
            } catch (error) {
                setError(error.message);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const clearErrors = useCallback(() => setError(null), []);

    return { isLoading, error, clearErrors, request };
};
