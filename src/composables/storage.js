export function storageManager() {

    var storage = {};
    storage.storeData = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }

    storage.removeData = (key) => {
        localStorage.removeItem(key);
    }

    storage.doesDataExist = (key) => {
        return localStorage.getItem(key) ? true : false;
    }

    storage.clearAll = () => {
        localStorage.clear();
    }

    storage.getData = (key) => {
        return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : '';
    }

    return {storage};


}


