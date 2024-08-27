import React, { useRef, useState, useEffect } from 'react';
import styles from '../../styles/AdminHome/CreateNewTable.module.css';
import axios from 'axios';
import CategoryRadioGroup from '../../HOOKS/CategoryRadioGroup';

const CreateNewCategory = React.memo(() => {
    const [currentOption, setCurrentOption] = useState(0);
    const [category, setCategory] = useState([]);
    const [AllMainCategory, setAllMainCategory] = useState([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState('');
    const [renameCategory, setRenameCategory] = useState({ main: '', sub: '' });
    const [selectedDeleteCategory, setSelectedDeleteCategory] = useState({ main: '', sub: '' });

    const newCategoryRef = useRef(null);
    const newSubRef = useRef(null);
    const renamedCategoryRef = useRef(null);

    useEffect(() => {
        const getCategoryAndSubCategory = async () => {
            try {
                const res = await axios.get('http://localhost:7000/get/category_and_sub_category');
                setCategory(res.data.category);

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
            await axios.post('http://localhost:7000/create/new/category', { newCategoryName: newCategoryRef.current.value.trim().toLowerCase() });
            setCurrentOption(0);
        } catch (err) {
            console.log(err);
        }
    };

    const handleNewSubCategory = async () => {
        try {
            await axios.post('http://localhost:7000/new/sub_category', { main: selectedMainCategory.trim(), newSub: newSubRef.current.value.trim().toLowerCase() });
            setCurrentOption(0);

        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await axios.post('http://localhost:7000/delete/category', selectedDeleteCategory);
            setCurrentOption(0);
        } catch (err) {
            console.log(err);
        }
    };

    const handleRenameChangeState = async () => {
        try {
            await axios.post('http://localhost:7000/rename/category', { main: renameCategory.main, sub: renameCategory.sub, newName: renamedCategoryRef.current.value.trim().toLowerCase() })
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

    const renderOptionContent = () => {
        switch (currentOption) {
            case 1:
                return (
                    <div className={styles.CreateNewCategory}>
                        <input type='text' placeholder='enter new category_name' ref={newCategoryRef} />
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
                                <input type='text' placeholder='new sub category_name' ref={newSubRef} />
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
                                <input type='text' placeholder='new name ?' ref={renamedCategoryRef} />
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
