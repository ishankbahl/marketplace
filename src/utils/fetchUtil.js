export default function fetchUtil(url, data = {}, setIsLoaded, setItems, setError) {
    fetch(url, data)
        .then(res => res.json())
        .then((result) => {
            setIsLoaded?.(true);
            setItems?.(result);
        },
        (error) => {
            setIsLoaded?.(true);
            setError?.(error);
        }
    )
}