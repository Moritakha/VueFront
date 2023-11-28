<template>
  <div>
    <div class="menubar">
      <div class="menu-buttons">
       <button class="menu-button" @click="openModal">New User</button>
       <button class="menu-button" @click="editUser">Edit</button>
       <button class="menu-button" @click="openConfirmationModal">Delete</button>
       <button class="menu-button" @click="getAll">Refresh</button>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-container">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>New User</h2>
        <!-- Formulario -->
        <form class="form-container">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="newUser.username" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="newUser.password" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="newUser.email" required>
          </div>
          <div class="form-group">
            <label for="createdAt">CreatedAt</label>
            <input type="Timestamp" id="createdAt" v-model="newUser.createdAt" required>
          </div>
          <div class="form-group">
            <label for="firstName">FirstName</label>
            <input type="text" id="firstName" v-model="newUser.firstName">
          </div>
          <div class="form-group">
            <label for="lastName">LastName</label>
            <input type="text" id="lastName" v-model="newUser.lastName">
          </div>
          <div class="form-group">
            <label for="age">Age</label>
            <input type="number" id="age" v-model="newUser.age" >
          </div>
          <div class="form-group">
            <label for="birthday">Birthday</label>
            <input type="Date" id="birthday" v-model="newUser.birthday" >
          </div>
          <button @click="save">Save</button>
          <button @click="goBack">Back</button>
        </form>
      </div>
    </div>
    <table class="custom-table">
      <thead>
        <tr>
          <th class="text-left header-cell">Id</th>
          <th class="text-left header-cell">Username</th>
          <th class="text-left header-cell">Password</th>
          <th class="text-left header-cell">Email</th>
          <th class="text-left header-cell">Created At</th>
          <th class="text-left header-cell">First Name</th>
          <th class="text-left header-cell">Last Name</th>
          <th class="text-left header-cell">Age</th>
          <th class="text-left header-cell">Birthday</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" @click="selectRow(user)" :class="{ 'selected-row': isSelected(user) }">
         <td class="data-cell">{{ user.id }}</td>
          <td class="data-cell">{{ user.username }}</td>
          <td class="data-cell">{{ user.password }}</td>
          <td class="data-cell">{{ user.email }}</td>
          <td class="data-cell">{{ user.createdAt }}</td>
          <td class="data-cell">{{ user.firstName }}</td>
          <td class="data-cell">{{ user.lastName }}</td>
          <td class="data-cell">{{ user.age }}</td>
          <td class="data-cell">{{ user.birthday }}</td>
        </tr>
      </tbody>
    </table>
    <ModalDelete v-if="isConfirmationModalOpen" @confirmed="deleteConfirmed" @canceled="closeConfirmationModal" />
  </div>
</template>

<script>
import UserService from '@/service/UserService';
import ModalDelete from '@/components/ModalDelete.vue';

export default {
  name: "UserApp",
  components: {
    ModalDelete,
  },
  data() {
    return {
      users: null,
      isModalOpen: false,
      isConfirmationModalOpen: false,
      newUser: {
        id:'',
        username: '',
        password:'',
        email: '',
        createdAt: new Date(),
        firstName: '',
        lastName: '', 
        age: '',
        birthday:'',
      },
      selectedRow: null, // Nuevo dato para almacenar la fila seleccionada
    };
  },
  UserService: null,

  created() {
    this.UserService = new UserService();
  },
  mounted() {
    this.getAll();
  },
  methods: {

    openModal() {
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
    },

    goBack() {
      this.closeModal();
    },

    confirm() {
      this.$emit('confirmed');
    },
    cancel() {
      this.$emit('canceled');
    },

    getAll(){
      this.UserService.getAll().then((data) => {
      this.users = data.data;
      }) 
    },
    save() {
      if(this.newUser.id){
        this.saveEditedUser();
      }else{
      this.UserService.save(this.newUser)
          .then(data => {
            if (data.status === 200) {
              this.newUser = {
                username: '',
                password: '',
                email: '',
                createdAt: new Date(),
                firstName: '',
                lastName: '',
                age: '',
                birthday: '',
              };
              this.getAll();
              this.closeModal();
            }
          })
          .catch(error => {
            console.error('Error al guardar nuevo usuario:', error);
          });
        }
    },
    selectRow(user) {
      if (this.selectedRow === user) {
        this.selectedRow = null;
      } else {
        this.selectedRow = user;
      }
    },

    isSelected(user) {
      return this.selectedRow === user;
    },
    editUser() {
      if (this.selectedRow) {
        this.newUser = { ...this.selectedRow };
        this.openModal();
      } else {
        console.warn('No se ha seleccionado ninguna fila para editar.');
      }
    },
    saveEditedUser() {
       this.UserService.editarUser(this.newUser.id, this.newUser)
       .then(data => {
      if (data.status === 200) {
        this.resetNewUser();
        this.getAll();
        this.closeModal();
        }
      })
     .catch(error => {
      console.error('Error al guardar cambios:', error);
        });
     },
    deleteUser() {
      if (this.selectedRow) {
        const userId = this.selectedRow.id;
        this.UserService.delete(userId)
          .then((response) => {
            if (response.status === 200) {
             this.selectedRow = null;
             this.getAll();
            }
           })
       .catch((error) => {
      console.error('Error al eliminar el usuario:', error);
    });
  } 
 },

    openConfirmationModal() {
      this.isConfirmationModalOpen = true;
    },
    closeConfirmationModal() {
      this.isConfirmationModalOpen = false;
    },
    deleteConfirmed() {
      this.deleteUser();
      this.closeConfirmationModal();
    },

 }
}
</script>

<style>
  .menubar {
    font-family: 'Arial', sans-serif;
    background-color: #8bd3c1;
    padding: 10px;
    text-align: center;
  }
  .menu-buttons {
      display: flex;
      justify-content: space-around;
      margin-top: 5px; /* Reduzco el espacio entre la barra de menú y los botones */
    }

    .menu-button {
      padding: 10px;
      background-color: #5f9ea0; /* Cambio el color de fondo a blanco */
      color: white; /* Cambio el color del texto a blanco */
      border: 1px solid #5f9ea0;
      border-radius: 5px;
      cursor: pointer;
    }

  .custom-table {
    font-family: 'Arial', sans-serif;
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .header-cell {
    background-color: #8bd3c1;
    color: #000000;
  }

  .data-cell {
    background-color: rgba(141, 196, 191, 0.5);
  }

  .custom-table th,
  .custom-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    font-family: 'Arial', sans-serif;
    color: #333;
  }

  .custom-table tbody tr:hover {
    background-color: #f5f5f5;
  }

  .modal-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.5s ease-out;
    font-family: 'Arial', sans-serif;
    color: #333; 
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
  }

  .form-container {
    display: flex;
    flex-direction: column;
  }

  .form-group {
    margin-bottom: 10px;
  }


  .selected-row {
    background-color: blue;
    color: white;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
</style>