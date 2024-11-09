/**
 * @type {Object}
 ** Configuration object for the application.
 ** Contains URLs for authentication, REST endpoints, and portal backend.
 ** It is used to determine the environment of the application.
 ** It uses the environment variable `REACT_APP_BACKEND` to determine the environment.
 *  The environment variables are set in the .env file
 ** Note: the environments we are currently using are: development, staging, and production.
 */
const config = {
  AUTH_SERVICE_URL: {
    development: 'http://localhost:8000',
  },

  REST_AUTH_URL: {
   development: 'http://localhost:8000',
  },
  REST_PORTAL_URL: {
    development: 'http://localhost:8000',

  }
};
export default config;
