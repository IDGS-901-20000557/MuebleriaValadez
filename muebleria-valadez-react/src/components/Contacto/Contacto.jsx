//import React from 'react'
import './Contacto.css'

const Contacto = () => {
    return (
        <div className="body">
            <div className="shadow rounded">
                <div>
                    <div className="container py-5 h-100">
                        <div className="row d-flex align-items-center justify-content-center h-100">
                            <div className="col-md-6">
                                <div id="contact" className="card mt-2">
                                    <div className="card-body">
                                        <form>
                                            <div className="form-outline mb-4">
                                                <div className="input-group">
                                                    <input id="txtName" type="text" className="form-control" placeholder="Nombre completo" />
                                                    <div className="input-group-append">
                                                        <span className="input-group-btn">
                                                            <a id="btnMessage" className="btn ala">
                                                                <span id="icon" className="fa fa-user"></span>
                                                            </a>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <div className="input-group">
                                                    <input id="txtEmail" type="text" className="form-control" placeholder="Ingrese su correo" />
                                                    <div className="input-group-append">
                                                        <span className="input-group-btn">
                                                            <a id="btnMessage" className="btn ala">
                                                                <span id="icon" className="fa fa-envelope"></span>
                                                            </a>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <textarea id="txtMessage" className="form-control" placeholder="Escriba su mensaje..." cols="30" rows="10"></textarea>
                                            </div>
                                            <input className="form-check-input mb-5" type="checkbox" value="" id="flexCheckDefault" />
                                            <label className="form-check-label" >
                                                Acepto los términos para enviar mi información y recibir correos.
                                            </label>
                                            <button id="btnSend" type="submit" className="btn btn-lg form-control"><b>ENVIAR</b></button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card" id="card-contact">
                                    <div className="pricing-block-content">
                                        <div className="price-value text-center">
                                            <p>Mueblería Valadez</p>
                                            <img src="img/Logo Gris.png" id="img-contact" />
                                        </div>
                                        <div className="pricing-note">Nos importa conocer su opinión.</div>
                                        <ul role="list" className="check-list">
                                            <li className="check-list-item"><i className="fa fa-phone" id="icono"></i> +52 477-805-38-81</li>
                                            <hr /><li className="check-list-item"><i className="fa fa-envelope" id="icono"></i><a className='ala' href="https://www.google.com/intl/es-419/gmail/about/"> contact@mueblesvaladez.com</a></li>
                                            <hr /><li className="check-list-item"><i className="fas fa-clock" id="icono"></i> Lunes-Viernes: 9:00 AM - 19:30 PM</li>
                                            <hr /><li className="check-list-item"><i className="fas fa-location" id="icono"></i><a className='ala' href="https://www.google.com.mx/maps/place/Blvd.+J.+J.+Torres+Landa+Ote.+6502,+Jardines+de+Jerez,+37530+Le%C3%B3n,+Gto./@21.0973453,-101.6434711,17z/data=!3m1!4b1!4m6!3m5!1s0x842bbe406674187f:0xdc2083c61e4c8546!8m2!3d21.0973403!4d-101.6408962!16s%2Fg%2F11gfmhmrj6?entry=ttu"> Blvd. J. J. Torres Landa Ote. 6502, Jardines de Jerez, 37530 León, Gto.</a></li>
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Contacto