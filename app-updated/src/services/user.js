import axios from "axios";
import Constants from "../utils/constants";

export default class UserService {
  static getById = async (id) => {
    let result = { data: null, error: null };
    await axios
      .get(`${process.env.REACT_APP_API_URL}/users/${id}`)
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

  static reload = async (token) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/self`,
        {},
        {
          headers: headers,
        }
      )
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

  static signup = async (obj) => {
    let result = { data: null, error: null };
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/signup`, obj)
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

  static activateAccount = async (id) => {
    let result = { data: null, error: null };
    const data = { token: id };

    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/activate`, data)
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

  static login = async (data) => {
    let result = { data: null, error: null };
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/login`, data)
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

  static forgotPassword = async (email) => {
    let result = { data: null, error: null };
    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/forgot-password`, {
        email: email,
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

  static resetPassword = async (token, password) => {
    let result = { data: null, error: null };
    const data = {
      token: token,
      newPassword: password,
    };

    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/reset-password`, data)
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

  static updatePassword = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/update-password`, data, {
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

  static update = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/update`, data, {
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

  static updatePicture = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/update-picture`, data, {
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

  static addFavourite = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/add-favourite`, data, {
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

  static removeFavourite = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/users/remove-favourite`, data, {
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

  static getFavourite = async (token) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[Constants.TOKEN_NAME] = token;

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/get-favourite`,
        {},
        {
          headers: headers,
        }
      )
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
