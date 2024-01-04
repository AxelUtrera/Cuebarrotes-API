const {
    getAllUsers,
    createCustomer,
    customerNotRegistered,
    editCustomerProfile,
    getProductsCatalog,
    addNewAddress,
    getOrdersHistoryOfCustomer,
    addNewPaymentMethod,
    cancelOrder,
    getCustomerByPhone
} = require('../../src/controllers/customerController');


const CustomerLogic = require('../../src/logic/customerLogic');
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

jest.mock('../../src/logic/customerLogic', () => ({
    createCustomer: jest.fn(),
    isCustomerRegister: jest.fn(),
    modifyCustomer: jest.fn(),
    getAllProducts: jest.fn(),
    addNewAddress: jest.fn(),
    getCustomerByPhone: jest.fn(),
    getOrdersHistoryOfCustomer: jest.fn(),
    cancelOrder: jest.fn(),
    addNewPaymentMethod: jest.fn()
}));

jest.mock('../../src/config/logger', () => ({
    error: jest.fn(),
}));

afterEach(() => {
    jest.clearAllMocks();
});

describe('createCustomer', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('crea un cliente exitosamente', async () => {
        CustomerLogic.createCustomer.mockResolvedValue(StatusCode.OK);

        const req = {
            body: {
                "nombre": "Axel Jordano",
                "apellidos": "Morales Utrera",
                "fechaNacimiento": null
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createCustomer(req, res);

        expect(CustomerLogic.createCustomer).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(res.json).toHaveBeenCalledWith({
            code: StatusCode.OK,
            msg: 'Customer created succesfully',
        });
    });

    test('maneja error al crear cliente', async () => {
        const simulatedError = new Error('Error simulado');
        CustomerLogic.createCustomer.mockRejectedValue(simulatedError);

        const req = {
            body: {
                "nombre": "Axel Jordano",
                "apellidos": "Morales Utrera",
                "fechaNacimiento": null
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        await createCustomer(req, res);
        expect(CustomerLogic.createCustomer).toHaveBeenCalledWith(req.body);

        expect(res.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({
            code: StatusCode.INTERNAL_SERVER_ERROR,
            msg: 'Customer not created',
        });
    });
});

describe('customerNotRegistered', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('maneja error al verificar el estado del cliente', async () => {
        CustomerLogic.isCustomerRegister.mockRejectedValue(new Error('Error simulado'));
        const req = {
            params: {
                numTelefono: '123456789',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await customerNotRegistered(req, res);

        expect(CustomerLogic.isCustomerRegister).toHaveBeenCalledWith('123456789');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            code: 500,
            msg: 'Error in customerNotRegistered Controller',
        });
    });

    test('verifica que el cliente no está registrado', async () => {
        CustomerLogic.isCustomerRegister.mockResolvedValue(false);
        const req = {
            params: {
                numTelefono: '123456789',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await customerNotRegistered(req, res);

        expect(CustomerLogic.isCustomerRegister).toHaveBeenCalledWith('123456789');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            code: 200,
            msg: 'The customer is not registered',
        });
    });

    test('verifica que el cliente está registrado', async () => {
        CustomerLogic.isCustomerRegister.mockResolvedValue(true);
        const req = {
            params: {
                numTelefono: '123456789',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await customerNotRegistered(req, res);

        expect(CustomerLogic.isCustomerRegister).toHaveBeenCalledWith('123456789');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            code: 201,
            msg: 'The customer is already registered',
        });
    });
});

describe('editCustomerProfile', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('modifica el perfil del cliente exitosamente', async () => {
        CustomerLogic.modifyCustomer.mockResolvedValue(200);
        const req = {
            params: {
                customerPhoneNumber: '123456789',
            },
            body: {
                "nombre": "Axel Jordano",
                "apellidos": "Morales Utrera",
                "fechaNacimiento": null
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await editCustomerProfile(req, res);

        expect(CustomerLogic.modifyCustomer).toHaveBeenCalledWith('123456789', req.body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            code: 200,
            msg: 'Customer profile modified succesfully :)',
        });
    });

    test('maneja error al modificar el perfil del cliente', async () => {
        CustomerLogic.modifyCustomer.mockRejectedValue(new Error('Error simulado'));
        const req = {
            params: {
                customerPhoneNumber: '123456789',
            },
            body: {
                "nombre": "Axel Jordano",
                "apellidos": "Morales Utrera",
                "fechaNacimiento": null
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await editCustomerProfile(req, res);

        expect(CustomerLogic.modifyCustomer).toHaveBeenCalledWith('123456789', req.body);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            code: 500,
            msg: 'Customer Profile not modified :(',
        });
    });
});

describe('getProductsCatalog', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    
    test('obtiene el catálogo de productos exitosamente', async () => {
        CustomerLogic.getAllProducts.mockResolvedValue(200);
        const req = mockRequest();
        const res = mockResponse();

        await getProductsCatalog(req, res);

        expect(CustomerLogic.getAllProducts).toHaveBeenCalled();
    });

    test('maneja error al obtener el catálogo de productos', async () => {
        CustomerLogic.getAllProducts.mockRejectedValue(new Error('Error simulado'));
        const req = mockRequest();
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getProductsCatalog(req, res);

        expect(CustomerLogic.getAllProducts).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            code: 500,
            msg: 'Products not obtained',
            response: [],
        });
    });
});
