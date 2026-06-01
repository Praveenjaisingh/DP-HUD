module.exports = (err,req,res,next)=>{

    console.log(err.message);   

    res.status(err.statusCode || 400).json({

        status:false,

        errors: err.errors || [err.message]

    });

};