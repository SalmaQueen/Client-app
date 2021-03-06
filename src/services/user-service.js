import Axios from 'axios';
import BaseService from './base-service';
import {
  setUser,
  clearUser,
  setUserToken,
  clearUserToken
} from '../redux/actions';
import store from '../redux/store';

import URL from './UrlServices'

class UserService extends BaseService {



  async register(data) {
    

    try {
      const response = await Axios.post(`${URL.baseURL}/users`, 
      JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      });

      if (response.status === 201) {
        const token = response.data.token;
        store.dispatch(setUserToken(token));
        return response.data;
      } else {
        throw new Error('Could not save user. Please try again')
      }
    } catch (error) {
      if (error.response.status === 422) {
        return error.response.data;
      }

      if (error.response.status < 422) {
        return this.errorMessage(error.response.data.message)
      }
      throw new Error('An error occurred. Please try again', error.response)
    }
  }

  async login(email, password) {
    store.dispatch(clearUserToken());
    try {
      const response = await Axios.post(`${URL.baseURL}/login`, { email, password });
      if (response.status === 200) {
        const token = response.data.token;
        store.dispatch(setUserToken(token));
        return true;
      } else {
        throw new Error('An error occurred.');
      }
    } catch (error) {
      if (error.response.status === 422) {
        return error.response.data;
      }
      if (error.response.status < 422) {
        return this.errorMessage(error.response.data.message)
      }
      return this.errorMessage('An error occurred. Please try again');
    }
  }

  profile = async () => {
    if (this.getUser()) {
      return this.getUser();
    } else {
      const response = await Axios.get(`${URL.baseURL}/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${this.token()}`
        }
      });

      if (response.status === 200) {
        store.dispatch(setUser(response.data));
      }
      return response.data;
    }
  }

  isLoggedIn = async () => {
    if (this.token()) {
      return true
    } else {
      return false;
    }
  }

  logout = () => {
    store.dispatch(clearUserToken());
    store.dispatch(clearUser());
  }

}

export default new UserService();