export const getItem = (name: string) => {
    const item = localStorage.getItem(name) || '';
    return item ? JSON.parse(item) : null;
};

export const setItem = (name: string, item: any) => {
    const itemJSON = JSON.stringify(item);
    localStorage.setItem(name, itemJSON);
};
