import React from 'react'
import axios from 'axios'
import {useState, useEffect} from 'react'
import Swal from 'sweetalert2'
import SHA512 from 'crypto-js/sha512';



const formProfile = ({user,mostrar , getDatos}) => {
    const [nombre, setNombre] = useState(user.nombres);
    const [apellidoP, setApellidoP] = useState(user.apellidoPaterno);
    const [apellidoM, setApellidoM] = useState(user.apellidoMaterno);
    const [telefono, setTelefono] = useState(user.telefono);
    const [correo, setCorreo] = useState(user.email);
    const [password, setPassword] = useState(user.password);
    const [idUsuario, setIdUsuario] = useState(user.idUsuario);


    const getData = async () => {
        
        console.log(user);
    }

    const sendData = async (e) => {
        e.preventDefault();
        let idCliente = sessionStorage.getItem('idCliente')
        let idUsuario = sessionStorage.getItem('idUsuario')
        let passwordAntes = user.password
        let savepassword = "";

        if(password == passwordAntes){
            savepassword = password
        }else{ 
            savepassword = SHA512(password).toString();
        }

        let datos = {
            'idUsuario': idUsuario,
            'nombres': nombre,
            'apellidoPaterno': apellidoP,
            'apellidoMaterno': apellidoM,
            'telefono': telefono,
            'email': correo,
            'password': savepassword,
            'idCliente': idCliente
        }

        console.log(datos);

        await axios.post("https://localhost:7010/user/User/ModificarUsuario?idUsuario=" + idUsuario + "&idUsuariob=" + idUsuario, datos).then((res) => {

            Swal.fire({
                icon: 'success',
                title: '¡Datos actualizados!',
                text: 'Tus datos han sido actualizados.',
                confirmButtonColor: '#20a124',
                confirmButtonText: 'Aceptar',
            });

            getDatos();
            mostrar(false);

        }).catch((error) => {
                
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'No se pudieron actualizar los datos.',
                confirmButtonColor: '#20a124',
                confirmButtonText: 'Aceptar',
            });
    
            }
        );


    }


    useEffect(() => {
        getData();
    }, [])

 return (
<>
    <form className="form-horizontal" role="form"  onSubmit={ (e) => sendData(e)}>
        <div className="row">
            <div className="col-md-6">
                <div className="form-group">
                    <label >Nombre</label>
                    <input type="text" className="form-control" id="txtnombre" required  value={nombre} onChange={(e) => setNombre(e.target.value)}/>
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                    <label  className="mt-2">Apellido Paterno</label>
                    <input type="text" className="form-control" id="txtAPaterno" required  value={apellidoP} onChange={(e) => setApellidoP(e.target.value)}/>
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                    <label className="mt-2">Apellido Materno</label>
                    <input type="text" className="form-control" id="txtAMaterno"  required value={apellidoM} onChange={(e) => setApellidoM(e.target.value)}/>
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                    <label  className="mt-2">Teléfono</label>
                    <input type="text" className="form-control" id="txtTelefono"  required value={telefono} onChange={(e) => setTelefono(e.target.value)}/>
                </div>
            </div>
            <div className="col-md-12">
                <div className="form-group">
                    <label  className="mt-2">Correo electrónico</label>
                    <input type="email" className="form-control" id="txtCorreo"  required value={correo} onChange={(e) => setCorreo(e.target.value)}/>
                </div>
            </div>
            <div className="col-md-12">
                <div className="form-group">
                    <label  className="mt-2">Contraseña</label>
                    <input type="password" className="form-control" id="txtPassword" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </div>
            <div className="col-md-6 mx-auto">
                <button className="btn btn-dark mt-4" type="submit">Guardar</button>
                <button className="btn btn-danger mt-4" type="submit" onClick={() => mostrar(false)}>Cancelar</button>
            </div>
        </div>
    </form>

    </>
  )
}

export default formProfile