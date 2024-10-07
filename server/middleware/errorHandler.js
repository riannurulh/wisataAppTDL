function errorHandler(err,req,res,next) {
    console.log(err,'aaaaaaaaaaaaaaaa');
    let status = err.status || 500
    let message = err.message || 'Internal Server Error'

    res.status(status).json({message})
}

module.exports = errorHandler