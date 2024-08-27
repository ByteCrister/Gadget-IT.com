import React, { useContext } from "react";
import { useData } from "../context/useData";
import { GetCategoryName } from "./GetCategoryName";

export const MakeDefendants = (mainCategory, subCategory) => {
  const { dataState } = useContext(useData);
  console.log('Inside MakeDefendants');
  console.log('mainCategory:', mainCategory);

  if (!dataState || !dataState.productStorage || !dataState.productStorage.subCategory) {
    console.log('Data state is incomplete.');
    return '';
  }

  const findParent = (mainCategory, parentArr = []) => {
    const parent_ = dataState.productStorage.subCategory.find((item) => {
      return item.sub_category_name === mainCategory;
    });

    if (parent_) {
      parentArr.push(parent_.main_category_name);
      return findParent(parent_.main_category_name, parentArr);
    } else {
      return parentArr;
    }
  };

  const parent = findParent(mainCategory, [subCategory, mainCategory]);

  const descendantText = parent.reverse().map((item) => `/${GetCategoryName(item)}`).join('');

  return descendantText;
};
