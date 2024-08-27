export const GetSortObjects = (text) => {
    const items = text.split('], [').map(item => item.replace(/[\[\]]/g, ''));

    const result = items.map(item => {
        const [key, values] = item.split(' : ');
        const parsedValues = values.split(/[, ]+/).map(value => value.trim()).filter(Boolean);
        return {
            [key.trim()]: parsedValues
        };
    });

    return result;
}