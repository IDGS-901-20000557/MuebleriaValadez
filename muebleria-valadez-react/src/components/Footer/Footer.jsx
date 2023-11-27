//import React from 'react'
import './Footer'
const Footer = () => {
    return (
        <>
            <footer className="bg-dark text-center text-white footer">
                <div className="container p-4 pb-0">
                    <div className="row">
                        <div className="col-6 col-md-2 mb-3">
                            <h1>Secciones</h1>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-white anal">Productos</a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-white anal">Sobre nosotros</a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-white anal">Contacto</a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-white anal">Crear cuenta</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-6 col-md-3 mb-3">
                            <h1>Ayuda</h1>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-white anal">Preguntas frecuentes</a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-white anal">Aviso de Privacidad</a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-white anal">Términos y condiciones</a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-white anal">Garantías</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-5 offset-md-1 mb-3">
                            <form >
                                <h1>Suscríbete al newsletter</h1>
                                <p className='pene'>Entérate de nuestras novedades, beneficios y contenido exclusivo.</p>
                                <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                                    <label className="visually-hidden"
                                    >Dirección de correo</label
                                    >
                                    <input
                                        id="newsletter1"
                                        type="text"
                                        className="form-control"
                                        placeholder="Dirección de correo"

                                    />
                                    <button className="btn btn-secondary" type="submit">Regístrate</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="d-flex flex-column flex-sm-row justify-content-between py-2 my-4 border-top">
                        <p className='pene'>© 2023 Mueblería Valadez. Todos los derechos reservados.</p>
                        <ul className="list-unstyled d-flex">
                            <section className="mb-4">
                                <a className="btn btn-outline-light btn-floating m-1 anal" href="https://www.facebook.com/" role="button">
                                    <i className="fab fa-facebook-f"></i>
                                </a>

                                <a className="btn btn-outline-light btn-floating m-1 anal" href="https://twitter.com/" role="button">
                                    <i className="fab fa-twitter"></i>
                                </a>

                                <a className="btn btn-outline-light btn-floating m-1 anal" href="https://pinterest.com/" role="button">
                                    <i className="fab fa-pinterest"></i>
                                </a>


                                <a className="btn btn-outline-light btn-floating m-1 anal" href="https://gmail.com/" role="button">
                                    <i className="fa fa-envelope"></i>
                                </a>

                                <a className="btn btn-outline-light btn-floating m-1 anal" href="https://web.whatsapp.com/" role="button">
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                            </section>
                        </ul>
                    </div>
                </div>

            </footer >
        </>

    )
}

export default Footer