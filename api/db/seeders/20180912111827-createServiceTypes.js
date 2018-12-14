const userService = require('../../services/userService');
module.exports = {
  up: () => new Promise((resolve, reject) => {
    const serviceTypes = [
      {
        name: 'Treatment Type',
        status: 1
      },
	    {
		    name: 'Type Of Services',
		    status: 1
	    },
	    {
		    name: 'Level Of Care',
		    status: 1
	    },
	    {
		    name: 'Treatment Focus',
		    status: 1
	    }
    ];
	
	  userService
      .createBulkServiceTypes(serviceTypes)
      .then(resolve)
      .catch(reject);
  }),

  down: () => { }
};
