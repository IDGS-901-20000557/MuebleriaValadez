//import React from 'react'
import { useState } from 'react';
import './Login.css'
import { useNavigate } from "react-router-dom";
import { SHA512 } from 'crypto-js';
import axios from 'axios';
import Swal from 'sweetalert2';
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log("holaaa");
        const { email, password } = formData;
        const encryptedPassword = SHA512(password).toString();

        try {
            // Realiza la solicitud HTTP al endpoint del backend
            const response = await login(email, encryptedPassword);
            console.log(response);
            sessionStorage.setItem('idUsuario', response.data[0].idUsuario);
            sessionStorage.setItem('idCliente', response.data[0].idCliente);
            // ... rest of the sessionStorage assignments
            console.log(response.data[0].idRol);
            switch (response.data[0].idRol) {
                case 1:
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error de inicio de sesión (solo clientes)!',
                        text: 'Usuario y/o contraseña incorrectos.',
                        confirmButtonColor: '#20a124',
                        confirmButtonText: 'Aceptar',
                    });
                    break;
                case 2:
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error de inicio de sesión!',
                        text: 'Usuario y/o contraseña incorrectos (solo clientes).',
                        confirmButtonColor: '#20a124',
                        confirmButtonText: 'Aceptar',
                    });
                    break;
                case 3:
                    // Le meti mano mi claudio
                    // Nomás así jalo chido el login
                    // Elimine navigate('/shop');
                    window.location.href = '/shop';
                    break;
                case 10002:
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error de inicio de sesión!',
                        text: 'Usuario y/o contraseña incorrectos (solo clientes).',
                        confirmButtonColor: '#20a124',
                        confirmButtonText: 'Aceptar',
                    });
                    break;
                default:
                    break;
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: '¡Error de inicio de sesión!',
                text: 'Usuario y/o contraseña incorrectos.',
                confirmButtonColor: '#20a124',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const login = async (email, password) => {
        const apiUrl = 'https://localhost:7010/auth/Auth/login';
        const body = {
            email: email,
            password: password
        };

        return await axios.post(apiUrl, body);
    };


    return (
        <div className="bodyna">
            <div className="shadow rounded">
                <div className="vh-100">
                    <div className="container py-5 h-100">
                        <div className="rowe row d-flex align-items-center justify-content-center h-100">
                            <div className="col-md-8 col-lg-7 col-xl-6">
                                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-indicators">
                                        <button className="botone active" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" aria-current="true" aria-label="Slide 1"></button>
                                        <button className="botone" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                        <button className="botone" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                        <button className="botone" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
                                    </div>
                                    <div className="carousel-inner">
                                        <div className="carousel-item active">
                                            <img id="imgLogo" className="img-fluid" src="img/login_2.jpg" alt="..." />
                                        </div>
                                        <div className="carousel-item">
                                            <img id="imgLogo" src="img/login_3.jpg" alt="..." />
                                        </div>
                                        <div className="carousel-item">
                                            <img id="imgLogo" src="img/login_4.jpg" alt="..." />
                                        </div>
                                        <div className="carousel-item">
                                            <img id="imgLogo" src="img/login_6.jpg" alt="..." />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                                <p id="title" className="text-center mt-3">Bienvenido</p>
                                <br />
                                <form onSubmit={onSubmit}>
                                    <div className="form-outline mb-4">
                                        <label className="form-label labellso">Correo</label>
                                        <input
                                            id="txtEmail"
                                            type="email"
                                            required
                                            name='email'
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control form-control-lg"

                                        />

                                    </div>
                                    <div className="form-outline mb-4">
                                        <label className="form-label labellso">Contraseña</label>
                                        <input
                                            id="txtPassword"
                                            required
                                            name='password'
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="form-control form-control-lg"

                                        />

                                    </div>


                                    <button
                                        id="btnLogin"
                                        type="submit"
                                        className="btn btn-lg form-control text-white botone"

                                    >
                                        <span>INGRESAR</span>
                                    </button >
                                    <br />
                                    <a

                                        href="/SignUp"
                                        className="text-center asa"
                                    >

                                        ¿Aún no tiene una cuenta?
                                    </a>
                                </form >
                            </div >
                        </div >
                    </div >
                </div >
            </div >
        </div >
    )
}

export default Login