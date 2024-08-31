import { useContext } from "react";
import { GetCategoryName } from "./GetCategoryName";
import { useData } from "../context/useData";

export const MakeDefendants = (mainCategory, subCategory) => {
  const { dataState } = useContext(useData);
  if (!dataState || !dataState.productStorage || !dataState.productStorage.subCategory) {
    console.log('Data state is incomplete.');
    return '';
  }

  const findParent = (mainCategory, parentArr = []) => {
    if (!mainCategory) return parentArr;

    const parent_ = dataState.productStorage.subCategory.find((item) => item.sub_category_name === mainCategory);
    if (parent_) {
      parentArr.push(parent_.main_category_name);
      return findParent(parent_.main_category_name, parentArr);
    }
    return parentArr;
  };

  const parent = findParent(mainCategory, [subCategory, mainCategory]);
  
  // Check for undefined or invalid values in parent array
  const validParent = parent.filter(Boolean); // Removes undefined/null elements
  const descendantText = validParent.reverse().map((item) => {
    const categoryName = GetCategoryName(item);
    return categoryName ? `/${categoryName}` : ''; // Ensure valid strings
  }).join('');

  return descendantText;
};
