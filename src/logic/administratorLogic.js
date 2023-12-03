const Logger = require("../config/logger");
const Product = require("../models/productModel");
const Branch = require("../models/branchModel");
const StatusCode = require("../models/httpStatusCodes");
const Employee = require("../models/employeeModel");

const createEmployee = (newEmployee) => {
    return new Promise((resolve, reject) => {
        const employeeToCreate = new Employee(newEmployee);

        employeeToCreate.save()
        .then(() => {
            resolve(StatusCode.OK)
        })
        .catch((error) => {
            Logger.error(`There was an error creating the employee: ${error}`);
            reject(StatusCode.INTERNAL_SERVER_ERROR);
        })
    })
}


const createProduct = (newProduct) => {
    return new Promise((resolve, reject) => {
        const productToCreate = new Product(newProduct);

        productToCreate.save()
        .then(() => {
            resolve(StatusCode.OK)
        })
        .catch((error) => {
            Logger.error(`There was an error creating the product: ${error}`);
            reject(StatusCode.INTERNAL_SERVER_ERROR);
        })
    })
}


const addProductToBranch = (branchName, productInfo) => {
    return new Promise((resolve, reject) => {
        Branch.findOneAndUpdate(
            {nombreComercial: branchName},
            {$push: {"inventario.productos": productInfo}}, {new: true}
        )
        .then(() => {
            resolve(StatusCode.OK)
        })
        .catch((error) => {
            Logger.error(`There was an error adding the product: ${error}`)
            reject(StatusCode.INTERNAL_SERVER_ERROR)
        })
    })
}


const getBranchesInfo = () => {
    let branchesObtained = []

    return new Promise((resolve, reject) => {
        branchesObtained = Branch.find({})
        .then((branchesObtained) => {
            resolve(branchesObtained)
        })
        .catch((error) => {
            Logger.error(`There was an error recovering the branches: ${error}`)
            reject(StatusCode.INTERNAL_SERVER_ERROR)
        })
    })
}


module.exports = {
    createProduct,
    addProductToBranch,
    createEmployee,
    getBranchesInfo
}
