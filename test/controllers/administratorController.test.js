const { createEmployee,
    createProduct,
    addProductToBranch,
    getBranches,
    createBranch,
} = require('../../src/controllers/administratorController');

const AdministratorLogic = require('../../src/logic/administratorLogic');
const BranchLogic = require('../../src/logic/branchLogic');
const StatusCode = require('../../src/models/httpStatusCodes');

const mockRequest = (body) => ({ body });
const mockResponse = () => {
    let statusCalledWith;
    let jsonCalledWith;

    return {
        status: function (status) {
            statusCalledWith = status;
            return this;
        },
        json: function (json) {
            jsonCalledWith = json;
        },
        getStatusCalledWith: () => statusCalledWith,
        getJsonCalledWith: () => jsonCalledWith,
    };
};

jest.mock('../../src/logic/administratorLogic', () => ({
    createEmployee: jest.fn(),
    createProduct: jest.fn(),
    addProductToBranch: jest.fn(),
    getBranchesInfo: jest.fn(),
}));

jest.mock('../../src/config/logger', () => ({
    error: jest.fn(),
}));

jest.mock('../../src/logic/branchLogic', () => ({
    createBranch: jest.fn()
}));

afterEach(() => {
    jest.clearAllMocks();
});

describe('createEmployee', () => {

    test('crea un nuevo empleado con éxito', async () => {
        AdministratorLogic.createEmployee.mockResolvedValue(200);

        const req = mockRequest();
        const res = mockResponse();

        await createEmployee(req, res);

        expect(AdministratorLogic.createEmployee).toHaveBeenCalledWith(req.body);

        expect(res.getStatusCalledWith()).toBe(200);
        expect(res.getJsonCalledWith()).toEqual({
            code: 200,
            msg: 'Employee created succesfully',
        });
    });

    test('fail to create an employee', async () => {
        //Simulacion de un error.
        AdministratorLogic.createEmployee.mockRejectedValue(new Error('This is a simulated error'));
        const req = mockRequest();
        const res = mockResponse();
        await createEmployee(req, res);
        expect(AdministratorLogic.createEmployee).toHaveBeenCalledWith(req.body);

        // Verifica que la respuesta del servidor sea la esperada
        expect(res.getStatusCalledWith()).toBe(500);
        expect(res.getJsonCalledWith()).toEqual({
            code: 500,
            msg: 'Employee not created',
        });
    });
});

describe('createProduct', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('crea un nuevo producto con éxito', async () => {

        AdministratorLogic.createProduct.mockResolvedValue(200);

        const req = mockRequest({
            nombre: 'Coca cola',
            descripcion: 'coca-cola 600ml',
            precioUnitario: 15.99
        });
        const res = mockResponse();

        await createProduct(req, res);

        expect(AdministratorLogic.createProduct).toHaveBeenCalledWith(req.body);
        expect(res.getStatusCalledWith()).toBe(200);
        expect(res.getJsonCalledWith()).toEqual({
            code: 200,
            msg: 'Product created succesfully',
        });
    });

    test('falla al crear un nuevo producto', async () => {
        AdministratorLogic.createProduct.mockResolvedValue(500);
        const req = mockRequest({
            body: {
                nombre: 'Coca',
                descripcion: 'coca-cola 600ml',
                precioUnitario: 15.99,
            }
        });
        const res = mockResponse();

        await createProduct(req, res);

        expect(AdministratorLogic.createProduct).toHaveBeenCalledWith(req.body);
        expect(res.getStatusCalledWith()).toBe(500);
        expect(res.getJsonCalledWith()).toEqual({
            code: 500,
            msg: 'Product not created',
        });
    });
});

describe('addProductToBranch', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('guarda información de la sucursal correctamente', async () => {
        AdministratorLogic.addProductToBranch.mockResolvedValue(StatusCode.OK);

        const req = {
            body: [
                {
                    nombreComercial: 'Sucursal A',
                    inventario: {
                        productos: [
                        ],
                    },
                },
            ],
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addProductToBranch(req, res);

        expect(AdministratorLogic.addProductToBranch).toHaveBeenCalledTimes(req.body.length);
        expect(res.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(res.json).toHaveBeenCalledWith({
            code: StatusCode.OK,
            msg: 'Branch information saved successfully',
        });
    });

    test('falla al guardar información de la sucursal', async () => {

        AdministratorLogic.addProductToBranch.mockResolvedValue(StatusCode.INTERNAL_SERVER_ERROR);

        const req = {
            body: [
                {
                    nombreComercial: 'Sucursal B',
                    inventario: {
                        productos: [

                        ],
                    },
                },
            ],
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addProductToBranch(req, res);

        expect(AdministratorLogic.addProductToBranch).toHaveBeenCalledTimes(req.body.length);
        expect(res.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({
            code: StatusCode.INTERNAL_SERVER_ERROR,
            msg: 'Error saving branch information',
        });
    });

    test('maneja errores inesperados', async () => {

        AdministratorLogic.addProductToBranch.mockRejectedValue(new Error('Error simulado'));

        const req = {
            body: [
                {
                    nombreComercial: 'Sucursal C',
                    inventario: {
                        productos: [

                        ],
                    },
                },
            ],
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        await addProductToBranch(req, res);

        expect(AdministratorLogic.addProductToBranch).toHaveBeenCalledTimes(req.body.length);
        expect(res.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({
            code: StatusCode.INTERNAL_SERVER_ERROR,
            msg: 'Branch information not saved',
        });
    });
});

describe('getBranches', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('obtiene las sucursales exitosamente', async () => {
        const mockBranches = [
            { id: 1, nombre: 'Sucursal A' },
            { id: 2, nombre: 'Sucursal B' },
        ];
        AdministratorLogic.getBranchesInfo.mockResolvedValue(mockBranches);
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        await getBranches(null, res);
        expect(AdministratorLogic.getBranchesInfo).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(res.json).toHaveBeenCalledWith({
            code: StatusCode.OK,
            msg: 'Branches obtained succesfully',
            response: mockBranches,
        });
    });

    test('maneja error al obtener sucursales', async () => {
        AdministratorLogic.getBranchesInfo.mockRejectedValue(new Error('Error simulado'));
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        await getBranches(null, res);
        expect(AdministratorLogic.getBranchesInfo).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({
            code: StatusCode.INTERNAL_SERVER_ERROR,
            msg: 'Branches not obtained :(',
            response: [],
        });
    });
});

describe('createBranch', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('crea una sucursal exitosamente', async () => {
        BranchLogic.createBranch.mockResolvedValue(StatusCode.OK);
        const req = {
            body: {
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createBranch(req, res);

        expect(BranchLogic.createBranch).toHaveBeenCalledWith(req.body);

        expect(res.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(res.json).toHaveBeenCalledWith({
            code: StatusCode.OK,
            msg: 'Sucursal creada exitosamente'
        });
    });

    test('maneja error al crear sucursal', async () => {
        BranchLogic.createBranch.mockRejectedValue(new Error('Error simulado'));
        const req = {
            body: {}
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createBranch(req, res);
        expect(BranchLogic.createBranch).toHaveBeenCalledWith(req.body);

        expect(res.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);

        expect(res.json).toHaveBeenCalledWith({
            code: StatusCode.INTERNAL_SERVER_ERROR,
            msg: 'Sucursal no creada'
        });
    });
});