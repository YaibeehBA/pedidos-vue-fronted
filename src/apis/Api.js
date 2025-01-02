import axios from 'axios';
import Swal from 'sweetalert2'
import { nextTick } from '@vue/runtime-core';


const Api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

export function show_alerta(msj,icon, focus){
    if(focus!==''){
        nextTick(()=> focus.value.focus()); 
    }
    Swal.fire({
        title:msj, 
        icon:icon,
        buttonsStyling:true
    });
}



export default Api;

