

const getAllData = async() : Promise<any> => {
    try {
        return;
    }
    catch(err) {
        console.log(err);
        return {err: "Request failed!"};
    }
};

export default {
    getAllData
};