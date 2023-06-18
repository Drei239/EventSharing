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

function expiredEventValidaiton(expiredEvent) {

}

module.exports = { existOrderValidation, limitUserValidation };