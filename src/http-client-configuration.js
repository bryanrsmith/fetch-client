import 'core-js';

/**
* A class for configuring HttpClients.
*
* @class HttpClientConfiguration
* @constructor
*/
export class HttpClientConfiguration {
  /**
  * The base URL to be prepended to each Request's url before sending.
  * @type {String}
  */
  baseUrl: string = '';

  /**
  * Default values to apply to init objects when creating Requests. Note that
  * defaults cannot be applied when Request objects are manually created because
  * Request provides its own defaults and discards the original init object.
  * See also https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
  * @type {Object}
  */
  defaults: IRequestInit = {};

  /**
  * Interceptors to be added to the HttpClient.
  * @type {Array}
  */
  interceptors: IInterceptor[] = [];

  /**
  * Sets the baseUrl.
  *
  * @param {String} baseUrl - The base URL.
  * @returns {HttpClientConfiguration}
  * @chainable
  */
  withBaseUrl(baseUrl: string): HttpClientConfiguration {
    this.baseUrl = baseUrl;
    return this;
  }

  /**
  * Sets the defaults.
  *
  * @param {Object} defaults - The defaults.
  * @returns {HttpClientConfiguration}
  * @chainable
  */
  withDefaults(defaults: IRequestInit): HttpClientConfiguration {
    this.defaults = defaults;
    return this;
  }

  /**
  * Adds an interceptor to be run on all requests or responses.
  *
  * @param {Object} interceptor - An object with request, requestError,
  * response, or responseError methods. request and requestError act as
  * resolve and reject handlers for the Request before it is sent.
  * response and responseError act as resolve and reject handlers for
  * the Response after it has been received.
  * @returns {HttpClientConfiguration}
  * @chainable
  */
  withInterceptor(interceptor: IInterceptor): HttpClientConfiguration {
    this.interceptors.push(interceptor);
    return this;
  }

  /**
  * Applies a configuration that addresses common application needs, including
  * configuring same-origin credentials, and using rejectErrorResponses.
  *
  * @returns {HttpClientConfiguration}
  * @chainable
  */
  useStandardConfiguration(): HttpClientConfiguration {
    let standardConfig = { credentials: 'same-origin' };
    Object.assign(this.defaults, standardConfig, this.defaults);
    return this.rejectErrorResponses();
  }

  /**
  * Causes Responses whose status codes fall outside the range 200-299 to reject.
  * The fetch API only rejects on network errors or other conditions that prevent
  * the request from completing, meaning consumers must inspect Response.ok in the
  * Promise continuation to determine if the server responded with a success code.
  * This method adds a response interceptor that causes Responses with error codes
  * to be rejected, which is common behavior in HTTP client libraries.
  *
  * @returns {HttpClientConfiguration}
  * @chainable
  */
  rejectErrorResponses(): HttpClientConfiguration {
    return this.withInterceptor({ response: rejectOnError });
  }
}

function rejectOnError(response) {
  if (!response.ok) {
    throw response;
  }

  return response;
}
