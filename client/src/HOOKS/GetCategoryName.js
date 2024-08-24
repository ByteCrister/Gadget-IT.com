export const GetCategoryName = (name) => {
    let formatted = name.replace(/_/g, ' ');

    formatted = formatted.split(' ').map(word => {
        return word.toLowerCase() === 'and' ? word : word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');

    return formatted;
}
