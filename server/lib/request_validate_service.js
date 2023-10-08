class RequestValidateService {
    validateRequiredFields(request, fields) {
        fields.forEach(field => {
            if (!request[field]) {
                throw new Error(`Field \"${field}\" has not been provided. All ${fields.join(", ")} fields are required.`);
            }
        });
    }
}

module.exports = RequestValidateService;