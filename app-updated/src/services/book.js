import axios from "axios";
import Constants from "../utils/constants";

export default class BookService {
  static list = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/books/list`, data, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static create = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/books/`, data, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static getById = async (token, id) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .get(`${process.env.REACT_APP_API_URL}/books/${id}`, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static getDetailsById = async (id) => {
    let result = { data: null, error: null };

    await axios
      .post(`${process.env.REACT_APP_API_URL}/books/details/${id}`)
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static getSimilar = async (genre) => {
    let result = { data: null, error: null };

    await axios
      .post(`${process.env.REACT_APP_API_URL}/books/similar`, { genre: genre })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static update = async (token, id, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .put(`${process.env.REACT_APP_API_URL}/books/${id}`, data, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static deleteById = async (token, id) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .delete(`${process.env.REACT_APP_API_URL}/books/${id}`, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };
}
