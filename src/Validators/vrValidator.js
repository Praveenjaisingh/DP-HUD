const { body, validationResult } = require("express-validator");

exports.searchValidator = [

    body("query")
        .notEmpty()
        .withMessage("Search query required")
        .isString()
        .withMessage("Query must be string")

];

exports.validate = (req,res,next)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){

        return res.status(400).json({
            status:false,
            errors:errors.array().map(err=>err.msg)
        });

    }

    next();

};