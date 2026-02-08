export const RequestHandler = async (url, options = {}) => {
    const request = await fetch(url, options);
    const response = await request.json();

    if(!request.ok) throw new Error(response.message || "Something went wrong");

    return response;
}