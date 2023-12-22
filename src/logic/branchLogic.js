const Branch = require("../models/branchModel");

async function createBranch(data) {
    try {
        const newBranch = new Branch(data);

        await newBranch.save();

        return 200;

    } catch (error) {
        throw error;
    }
}

module.exports = { createBranch };
