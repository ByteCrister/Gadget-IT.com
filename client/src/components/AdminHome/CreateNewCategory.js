import React, { useState, useEffect } from 'react';
import styles from '../../styles/AdminHome/CreateNewTable.module.css';
import axios from 'axios';
import CategoryRadioGroup from '../../HOOKS/CategoryRadioGroup';

const CreateNewCategory = React.memo(({ setErrorCategory }) => {
    const [currentOption, setCurrentOption] = useState(0);
    const [category, setCategory] = useState([]);
    const [AllMainCategory, setAllMainCategory] = useState([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState('');
    const [renameCategory, setRenameCategory] = useState({ main: '', sub: '' });
    const [selectedDeleteCategory, setSelectedDeleteCategory] = useState({ main: '', sub: '' });
    const [CategoryStates, setCategoryState] = useState({
        main: [],
        sub: []
    });
    const [AllCategoryRef, setAllCategoryRef] = useState({
        newCategoryRef: '',
        newSubRef: '',
        renamedCategoryRef: ''
    });

    useEffect(() => {
        const getCategoryAndSubCategory = async () => {
            try {
                const res = await axios.get('http://localhost:7000/get/category_and_sub_category');
                setCategory(res.data.category);
                setCategoryState({ main: res.data.mainCategory, sub: res.data.subCategory });
                let AllMain = [];
                res.data.mainCategory.forEach(items => AllMain.push(items.category_name));
                res.data.subCategory.forEach(items => AllMain.push(items.main_category_name));
                setAllMainCategory(AllMain);
            } catch (err) {
                console.log(err);
            }
        };

        getCategoryAndSubCategory();
    }, [currentOption]);

    const handleCreateNewCategory = async () => {
        try {
            const isInMainIncludes = CategoryStates.main.some(category => category.category_name === AllCategoryRef.newCategoryRef);
            const isInSubIncludes = CategoryStates.sub.some(category => category.sub_category_name === AllCategoryRef.newCategoryRef);
            if (!(isInMainIncludes || isInSubIncludes)) {
                await axios.post('http://localhost:7000/create/new/category', { newCategoryName: AllCategoryRef.newCategoryRef });
                setCurrentOption(0);
            } else {
                setErrorCategory({ message: 'This category is already exist! Please give any different name.', isError: true })
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleNewSubCategory = async () => {
        try {
            const isInMainIncludes = CategoryStates.main.some(category => category.category_name === AllCategoryRef.newSubRef);
            const isInSubIncludes = CategoryStates.sub.some(category => category.sub_category_name === AllCategoryRef.newSubRef);
            if (!(isInMainIncludes || isInSubIncludes)) {
                await axios.post('http://localhost:7000/new/sub_category', { main: selectedMainCategory.trim(), newSub: AllCategoryRef.newSubRef });
                setCurrentOption(0);
            } else {
                setErrorCategory({ message: 'This category is already exist! Please give any different name.', isError: true })
            }

        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            const res = await axios.get(`http://localhost:7000/is-category-empty/${selectedDeleteCategory.sub}`);
            if (window.confirm('Do you want to delete this category? There could be gone many Information!!')) {
                if (!res.data) {
                    await axios.post('http://localhost:7000/delete/category', selectedDeleteCategory);
                    setCurrentOption(0);
                } else {
                    setErrorCategory({ message: `There are product's in this category. Delete the product first!`, isError: true });
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleRenameChangeState = async () => {
        try {
            await axios.post('http://localhost:7000/rename/category', { main: renameCategory.main, sub: renameCategory.sub, newName: AllCategoryRef.renamedCategoryRef })
            setCurrentOption(0);
        } catch (error) {
            console.log(error);
        }
    };

    const handleResetValues = () => {
        setSelectedMainCategory('');
        setSelectedDeleteCategory({ main: '', sub: '' });
        setRenameCategory({ main: '', sub: '' });
    };


    const handleCategoryInput = (e) => {
        const key = e.nativeEvent.inputType;
        if (key === 'deleteContentBackward') {
            setAllCategoryRef((prev) => ({
                ...prev,
                [e.target.id]: prev[e.target.id].slice(0, -1)
            }));
            return;
        }
        const trimmedText = e.target.value.trim();
        if ((trimmedText.length === 1 && trimmedText.charAt(0) === '_') || (trimmedText.charAt(trimmedText.length - 1) === '_' && trimmedText.charAt(trimmedText.length - 2) === '_')) {
            return;
        }
        const lastLetter = trimmedText.toLowerCase().charAt(trimmedText.length - 1);
        const acceptedLetters = 'abcdefghijklmnopqrstuvwxyz_';
        const isValid = acceptedLetters.includes(lastLetter);
        if (isValid) {
            setAllCategoryRef((prev) => ({
                ...prev,
                [e.target.id]: prev[e.target.id] + lastLetter
            }));
        }

    };

    const renderOptionContent = () => {
        switch (currentOption) {
            case 1:
                return (
                    <div className={styles.CreateNewCategory}>
                        <input type='text' id='newCategoryRef' placeholder='enter new category_name' value={AllCategoryRef.newCategoryRef} onChange={(e) => handleCategoryInput(e)} />
                        <button onClick={handleCreateNewCategory}>Create</button>
                    </div>
                );
            case 2:
                return (
                    <div className={styles.CreateNewSubCategory}>
                        <label>Select Main Category</label>
                        <CategoryRadioGroup
                            category={category}
                            AllMainCategory={AllMainCategory}
                            onChange={setSelectedMainCategory}
                            name="createCategory"
                        />
                        {selectedMainCategory && (
                            <div className={styles.CreateNewCategory}>
                                <input type='text' id='newSubRef' placeholder='new sub category_name' value={AllCategoryRef.newSubRef} onChange={(e) => handleCategoryInput(e)} />
                                <button onClick={handleNewSubCategory}>Create</button>
                            </div>
                        )}
                    </div>
                );
            case 3:
                return (
                    <div className={styles.DeleteCategory}>
                        <label>Select Category You Want to Delete</label>
                        <CategoryRadioGroup
                            category={category}
                            AllMainCategory={AllMainCategory}
                            onChange={(sub, main) => setSelectedDeleteCategory({ main, sub })}
                            name="deleteCategory"
                        />
                        {selectedDeleteCategory.main && (
                            <div className={styles.CreateNewCategory}>
                                <button onClick={handleDeleteCategory}>Delete</button>
                            </div>
                        )}
                    </div>
                );
            case 4:
                return (
                    <div className={styles.RenameCategory}>
                        <label>Rename Category's</label>
                        <CategoryRadioGroup
                            category={category}
                            AllMainCategory={AllMainCategory}
                            onChange={(sub, main) => setRenameCategory({ main, sub })}
                            name="renameCategory"
                        />
                        {renameCategory.main && (
                            <div className={styles.CreateNewCategory}>
                                <input type='text' id='renamedCategoryRef' placeholder='new name ?' value={AllCategoryRef.renamedCategoryRef} onChange={(e) => handleCategoryInput(e)} />
                                <button onClick={handleRenameChangeState}>Rename</button>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.createTableMainContainer}>
            <section className={styles.DifferentOption}>
                <select value={currentOption} onChange={(e) => { setCurrentOption(Number(e.target.value)); handleResetValues() }}>
                    <option value={0}>Select...</option>
                    <option value={1}>Create New Category</option>
                    <option value={2}>Create New Sub Category</option>
                    <option value={3}>Delete Old Category</option>
                    <option value={4}>Rename Existing Category's</option>
                </select>
            </section>
            {renderOptionContent()}
        </div>
    );
}
)

export default CreateNewCategory;
