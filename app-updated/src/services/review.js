import axios from "axios";
import Constants from "../utils/constants";

export default class ReviewService {
  static getMine = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/reviews/mine`, data, {
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
      .post(`${process.env.REACT_APP_API_URL}/reviews/`, data, {
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

  static getByBookId = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/reviews/book`, data, {
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
      .delete(`${process.env.REACT_APP_API_URL}/reviews/${id}`, {
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
