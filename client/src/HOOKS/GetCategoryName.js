export const GetCategoryName = (category) => {
    let name = '';
    let names = '';
    category.split('_').forEach((item_name, index) => {
        name = item_name === 'and' ? item_name.charAt(0) : item_name.charAt(0).toUpperCase();
        if (index === 0) {
            names += name + item_name.substring(1);
        } else {
            names += ' ' + name + item_name.substring(1);
        }
    });;

    return names;
}
