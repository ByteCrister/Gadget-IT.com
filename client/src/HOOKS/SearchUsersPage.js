export const SearchUsersPage = (searchItem, userStore, setUserData) => {
    searchItem = String(searchItem).toLowerCase();
    let UpdatedData = userStore.map((userObject) => {
        return {
            ...userObject,
            point: 0
        }
    });
    userStore.forEach((userObject) => {
        let totalPoint = 0;
        Object.entries(userObject.user).forEach(([key, value]) => {
            if (key !== 'password') {
                totalPoint += String(value).toLowerCase().includes(searchItem) ? 1 : 0;
                totalPoint += String(value) === searchItem ? 10 : 0;
            }
        });
        UpdatedData = UpdatedData.map((userObject_) => {
            return userObject_.user.user_id === userObject.user.user_id
                ? { ...userObject_, point: totalPoint }
                : userObject_
        });
    });

    UpdatedData = UpdatedData.filter((userObject) => {
        return String(userObject.user.user_id).includes(searchItem) ||
            searchItem.includes(String(userObject.user.user_id)) ||
            String(userObject.user.first_name + userObject.user.last_name).toLowerCase().includes(searchItem) ||
            searchItem.includes(String(userObject.user.first_name + userObject.user.last_name).toLowerCase()) ||
            String(userObject.user.email).toLowerCase().includes(searchItem) ||
            searchItem.includes(String(userObject.user.email).toLowerCase()) ||
            String(new Date(userObject.user.signIn_time).toLocaleString().toLowerCase()).includes(searchItem) ||
            searchItem.includes(String(new Date(userObject.user.signIn_time).toLocaleString().toLowerCase()))
    });

    UpdatedData.sort((a, b) => {
        return b.point - a.point;
    });
    setUserData((prev) => ({
        ...prev,
        UserDataStore: UpdatedData
    }));
};