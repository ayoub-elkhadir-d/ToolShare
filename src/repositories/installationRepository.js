const Installation = require('../models/Installation.js');

class InstallationRepository{
    async getInstallation(){
        return await Installation.findOne();
    }

    async createInstallation(data,session = null){
        const installation = new Installation(data);
        return await installation.save({session});
    }
}

module.exports = new InstallationRepository();