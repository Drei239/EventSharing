function existOrderValidation(existOrder) {
    if (!existOrder) {
        return true;
    } else {
        return false;
    }
};

function limitUserValidation(limitUser, listUser) {
    if (limitUser > listUser.length) {
        return true;
    } else {
        return false;
    }
};

function eventExistOrderValidation(requestOrder) {
    if (requestOrder && requestOrder.length > 0) {
        return true;
    } else {
        return false;
    }
}

module.exports = { existOrderValidation, limitUserValidation, eventExistOrderValidation };