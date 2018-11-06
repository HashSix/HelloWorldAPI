/*
 * Create and export configuration variables
 *
 */

 // Container for all the environments
 var environments = {};

 // Staging (default) environment
 environments.staging = {
    'httpPort' : 3000,
    'envName' : 'staging'
 };

 environments.production = {
    'httpPort' : 80,
    'envName' : 'production'
 };

 // Determine which environment was passed as command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging
var envrionmentToExport = typeof(environments[currentEnvironment]) == 'object'? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = envrionmentToExport;
