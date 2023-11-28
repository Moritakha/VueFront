import axios from 'axios';

export default class UserService{

  url = "http://localhost:8080/api/user?detailed=true"

  getAll(){
    return axios.get(this.url);
  }

  save(newUser) {
    return axios.post(this.url, newUser);
  }

  editarUser(userId, userData) {
    return axios.put(`http://localhost:8080/api/user/${userId}`, userData);
  }
  delete(userId) {
    return axios.delete(`http://localhost:8080/api/user/${userId}`);
  }

  
}