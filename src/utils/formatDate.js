const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
}

export const mdDate = (timestamp) => {
    const date = new Date(timestamp);

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${month}-${day}`;
    return formattedDate
}

export default formatDate