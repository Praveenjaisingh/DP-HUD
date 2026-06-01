const vrService = require("../Services/vrService");

exports.searchData = async (req,res,next)=>{

    try{

        const data = await vrService.searchData(req.body);
        return res.status(200).json({
            status:true,
            message:"Data fetched successfully",
            data:data
        });

    }catch(error){
        next(error);
    }

};


