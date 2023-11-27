//import React from 'react'

import { useState } from "react";
import Swal from "sweetalert2";
import axios from 'axios';
import './SignUp.css'
import { useNavigate } from "react-router-dom";
import SHA512 from 'crypto-js/sha512';
const SignUp = () => {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const changeIcon = () => {
        const passwordInput = document.getElementById('txtPassword');
        const eyeIcon = document.getElementById('eyeIcon');

        if (isPasswordVisible) {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }

        setIsPasswordVisible(!isPasswordVisible);
    };

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellidoP: '',
        apellidoM: '',
        telefono: '',
        correo: '',
        password: '',
        password2: '',
    });

    const apiUrl = 'https://localhost:7010/auth/Auth';

    const signUp = async () => {
        const { nombre, apellidoP, apellidoM, telefono, correo, password } = formData;

        const body = {
            email: correo,
            password: SHA512(password).toString(),
            persona: {
                nombres: nombre,
                apellidoPaterno: apellidoP,
                apellidoMaterno: apellidoM,
                telefono: telefono,
            },
        };

        try {
            const response = await axios.post(apiUrl, body, { responseType: 'text' });
            // Manejar la respuesta después de registrarse exitosamente
            console.log(response);

            Swal.fire({
                icon: 'success',
                title: '¡Usuario creado!',
                text: '¡Bienvenido!',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
            }).then(() => {
                // Redirigir al usuario a la página de inicio de sesión (/auth) después de mostrar el mensaje de éxito
                // Reemplaza la redirección con el método adecuado para tu enrutamiento
                navigate('/login');
            });
        } catch (error) {
            console.error('Error al crear usuario:', error);

            Swal.fire({
                icon: 'error',
                title: '¡Error a la hora de crear usuario!',
                text: 'Ocurrió un error al crear el usuario.',
            });
        }
    };

    const userFind = async (correo) => {
        const findUrl = 'https://localhost:7010/auth/Auth/userFind';
        const body = {
            email: correo,
        };

        try {
            const result = await axios.post(findUrl, body, { responseType: 'text' });
            const exists = JSON.parse(result.data);
            if (exists.exists) {
                Swal.fire({
                    icon: 'warning',
                    title: '¡Elija otro correo!',
                    text: 'El correo ingresado ya se encuentra registrado.',
                    confirmButtonColor: '#20a124',
                    confirmButtonText: 'Aceptar',
                });
            } else {
                // Realizar el registro del usuario si el correo no existe
                signUp();
            }
        } catch (error) {
            console.error('Error al buscar usuario:', error);

            Swal.fire({
                icon: 'error',
                title: '¡Error a la hora de crear usuario!',
                text: 'Ocurrió un error al crear el usuario.',
            });
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        if (formData.password !== formData.password2) {
            Swal.fire({
                icon: 'info',
                title: 'Contraseñas incorrectas',
                text: 'Las contraseñas ingresadas no coinciden. Intente de nuevo.',
                confirmButtonColor: '#20a124',
                confirmButtonText: 'Aceptar',
            });
        } else if (formData.password === formData.password2) {
            userFind(formData.correo);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <>
            <div className="cuerpo">
                <br />
                <div className="contenedor p-4 mt-5 shadow rounded">
                    <h2 id="tituloFormulario" className="text-center mt-1">Creación de cuenta</h2>
                    <br />
                    <form onSubmit={onSubmit}>
                        <div className="row mt-3">
                            <div className="form-group col-12 col-md-4">
                                <label className="form-label">Nombre</label>
                                <input required id="txtnombre"
                                    value={formData.nombre} // Vincula el valor del campo con el estado formData.nombre
                                    onChange={handleInputChange}
                                    minLength={3} maxLength={100} name="nombre" type="text" className="form-control form-control-lg" />
                            </div>
                            <div className="form-group col-12 col-md-4">
                                <label className="form-label">Apellido Paterno</label>
                                <input required id="txtAPaterno"
                                    value={formData.apellidoP} // Vincula el valor del campo con el estado formData.apellidoP
                                    onChange={handleInputChange}
                                    minLength={3} maxLength={100} name="apellidoP" type="text" className="form-control form-control-lg" />
                            </div>
                            <div className="form-group col-12 col-md-4">
                                <label className="form-label">Apellido Materno</label>
                                <input
                                    value={formData.apellidoM} // Vincula el valor del campo con el estado formData.apellidoM
                                    onChange={handleInputChange}
                                    name="apellidoM" id="txtAMaterno" type="text" className="form-control form-control-lg" />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="form-group col-12 col-md-4">
                                <label className="form-label">Teléfono</label>
                                <div className="input-group">
                                    <input
                                        value={formData.telefono} // Vincula el valor del campo con el estado formData.telefono
                                        onChange={handleInputChange}
                                        required name="telefono" minLength={10} maxLength={20} id="txtTelefono" type="text" className="form-control form-control-lg" />
                                    <div className="input-group-append">
                                        <span className="input-group-btn">
                                            <a id="btnPhone" className="botonTelefono">
                                                <span className="fa fa-question-circle"></span>
                                            </a>
                                        </span>
                                        <div className="tooltip">
                                            El registro de un número télefonico es con el propósito de medio de contacto en un envío de compra.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-12 col-md-8">
                                <label className="form-label">E-mail</label>
                                <input
                                    value={formData.correo} // Vincula el valor del campo con el estado formData.email
                                    onChange={handleInputChange}
                                    required name="correo" minLength={3} maxLength={100} id="txtEmail" type="text" className="form-control form-control-lg" />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="form-group col-12 col-md-6">
                                <label className="form-label">Contraseña</label>
                                <div className="input-group">
                                    <input required name="password"
                                        value={formData.password} // Vincula el valor del campo con el estado formData.password
                                        onChange={handleInputChange}
                                        id="txtPassword" minLength={3} maxLength={50} type="password" className="form-control form-control-lg" />
                                    <div className="input-group-append">
                                        <button onClick={changeIcon} type="button" id="btnPassword" className="botonContrasena">
                                            <i
                                                id="eyeIcon"
                                                className={isPasswordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'}
                                                style={{ backgroundColor: 'transparent' }}></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-12 col-md-6">
                                <label className="form-label">Repita su contraseña</label>
                                <input required
                                    value={formData.password2} // Vincula el valor del campo con el estado formData.password2
                                    onChange={handleInputChange}
                                    id="txtPassword2" name="password2" minLength={3} maxLength={50} type="password" className="form-control form-control-lg" />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="form-group col-12 col-md-6 mt-4">
                                <button id="botonCrear" type="submit" className="btn btn-lg form-control text-center">CREAR CUENTA</button>
                            </div>
                            <div className="form-group col-12 col-md-6">
                                <a className="text-center text-white" href="/login">
                                    <button id="botonVolver" type="button" className="btn btn-lg form-control mt-4">REGRESAR</button>
                                </a>
                            </div>
                        </div>

                    </form>
                </div><br /><br />
            </div>


        </>
    )
}

export default SignUp