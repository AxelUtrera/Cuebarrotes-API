const Logger = require('../config/logger');
const AdministratorLogic = require('../logic//administratorLogic');
const StatusCode = require('../models/httpStatusCodes');
const Branch = require('../logic/branchLogic');


const createEmployee = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR;
    let response = "Employee not created"

    try{
        const newEmployee = req.body

        resultCode = await AdministratorLogic.createEmployee(newEmployee);
        if(resultCode == 200){
            response = "Employee created succesfully";
        }
    } catch(error){
        Logger.error(`Error in createEmployee controller. ${error}`);
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    })
}


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
    let response = "Branch information not saved";

    try {
        const branchesInfo = req.body;

        const results = await Promise.all(
            branchesInfo.map(async (branchInfo) => {
                const result = await AdministratorLogic.addProductToBranch(branchInfo.nombreComercial, branchInfo.inventario.productos);

                return result;
            })
        );

        if (results.every(result => result === StatusCode.OK)) {
            resultCode = StatusCode.OK;
            response = "Branch information saved successfully";
        } else {
            resultCode = StatusCode.INTERNAL_SERVER_ERROR;
            response = "Error saving branch information";
        }
    } catch (error) {
        Logger.error(`Error in saveBranchesInfo controller: ${error}`);
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response,
    });
};


const getBranches = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR
    let responseMessage = "Branches not obtained :("
    let response = []

    try{
        response = await AdministratorLogic.getBranchesInfo()
        if(response !== null){
            resultCode = StatusCode.OK
            responseMessage = "Branches obtained succesfully"
        }
    } catch(error){
        Logger.error(`There was an errror in getBranches controller: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage,
        response
    })
}


const createBranch = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR;
    let response = "Sucursal no creada";

    try {
        const newBranch = req.body;

        resultCode = await Branch.createBranch(newBranch);
        if (resultCode == 200) {
            response = "Sucursal creada exitosamente";
        }
    } catch (error) {
        Logger.error(`Error al crear la sucursal: ${error}`);
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    });
};



module.exports = {
    createProduct,
    addProductToBranch,
    createEmployee,
    getBranches,
    createBranch
}