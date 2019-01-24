//Global hooks module
module.exports = {
      hooks: {
          beforeFind: (options) => {
            if(!options.attributes){
              options.attributes = {};
            }
            options.attributes.exclude = [ 'createdAt','updatedAt']; //Exclude the defined column in array from every
            // select query results
            return options;
          }
      }
  };
