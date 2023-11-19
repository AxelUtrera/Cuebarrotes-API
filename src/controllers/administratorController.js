const Logger = require('../config/logger');
const AdministratorLogic = require('../logic//administratorLogic');
const StatusCode = require('../models/httpStatusCodes');


const createProduct = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR;
    let response = "Product not created"

    try{
        const newProduct = req.body

        resultCode = await AdministratorLogic.createProduct(newProduct);
        if(resultCode == 200){
            response = "Product created succesfully";
        }
    } catch(error){
        Logger.error(`Error in createProduct controller. ${error}`);
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    })
}


const addProductToBranch = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR;
    let response = "Product not added to the branch"

    try{
        const branchName = req.params.branchName;
        const productInfo = req.body;

        resultCode = await AdministratorLogic.addProductToBranch(branchName, productInfo);
        if(resultCode == 200){
            response = "Product added to the branch succesfully";
        }
    } catch(error){
        Logger.error(`Error in addProductToBranch controller: ${error}`);
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    })
}


module.exports = {
    createProduct,
    addProductToBranch
}