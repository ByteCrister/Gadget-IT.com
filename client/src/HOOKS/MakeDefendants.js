export const MakeDefendants = (mainCategory, subCategory) => {
  const { dataState } = useContext(useData);
  
  // Ensure dataState and productStorage exist before proceeding
  if (!dataState?.productStorage?.subCategory || !Array.isArray(dataState.productStorage.subCategory)) {
    console.log('Data state is incomplete or subCategory is not an array.');
    return '';
  }

  const findParent = (mainCategory, parentArr = []) => {
    if (!mainCategory) return parentArr;

    const parent_ = dataState.productStorage.subCategory.find(
      (item) => item.sub_category_name === mainCategory
    );

    if (parent_ && parent_.main_category_name) {
      parentArr.push(parent_.main_category_name);
      return findParent(parent_.main_category_name, parentArr);
    }
    return parentArr;
  };

  const parent = findParent(mainCategory, [subCategory, mainCategory]);

  // Ensure `parent` is valid before using map
  if (!Array.isArray(parent)) {
    console.log('Parent categories are invalid.');
    return '';
  }

  const validParent = parent.filter(Boolean); // Removes null/undefined elements
  const descendantText = validParent
    .reverse()
    .map((item) => {
      const categoryName = GetCategoryName(item);
      return categoryName ? `/${categoryName}` : ''; // Ensure valid strings
    })
    .join('');

  return descendantText;
};
