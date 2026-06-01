const vrRepository = require("../Repositories/vrRepository");
const AppError = require("../Helpers/AppError");

class vrService {

    async searchData(data){

        const result = await vrRepository.searchData(data);
        if(!result){
            throw new AppError("No data found");
        }
        return result;
    }

}

module.exports = new vrService();