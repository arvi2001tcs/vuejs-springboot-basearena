import axios from 'axios'

let API = {}
const PROTOCOL = 'http'

function call (baseUrl, reqType, relURL, params = {}) {
  if (baseUrl === 'NOT_SET') {
    console.log('BACKEND_HOSTNAME required!')
  } else {
    if (baseUrl.split('://').length < 2) {
      baseUrl = PROTOCOL + '://' + baseUrl
    }
    var reqOptions = {
      method: reqType,
      url: baseUrl + '/api/' + relURL,
      data: params
    }
    return axios.request(reqOptions)
  }
}

API.call = call

export default API
