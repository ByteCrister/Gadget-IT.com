import { useContext } from "react";
import { GetCategoryName } from "./GetCategoryName";
import { useData } from "../context/useData";

export const MakeDefendants = (mainCategory, subCategory) => {
  const { dataState } = useContext(useData);

  // ✅ If data is still loading, return an empty string (or a loading state)
  if (!dataState?.productStorage?.subCategory || !Array.isArray(dataState.productStorage.subCategory)) {
    console.log('⏳ Data is still loading...');
    return '';  // Prevents breaking the app during the initial render
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

  // ✅ Ensure `parent` is an array before using `.map()`
  if (!Array.isArray(parent)) {
    console.log('🚨 Parent categories are invalid.');
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