//Global hooks module
module.exports = {
      hooks: {
          beforeFind: (options) => {
            if(!options.attributes){
              options.attributes = {};
            }
            //Exclude the defined column in array from every select query results.
            options.attributes.exclude = [ 'is_deleted','updatedAt']; 
            return options;
          }
      }
  };
