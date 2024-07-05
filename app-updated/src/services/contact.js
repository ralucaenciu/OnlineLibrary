import axios from "axios";
import Constants from "../utils/constants";

export default class ReviewService {
  static list = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/contacts/list`, data, {
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
      .post(`${process.env.REACT_APP_API_URL}/contacts/`, data, {
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
