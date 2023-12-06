import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const FormTarjeta = ({ mostrar, getTarjetas }) => {

  const [numbertarjeta, setNumbertarjeta] = useState("");
  const [name, setName] = useState("");
  const [expiration, setExpiration] = useState("");
  const [csv, setCsv] = useState("");


  const handleSubmit = async (e) => {

    e.preventDefault();
    handleadd();

  }

  const handleadd = async () => {

    let idCliente = sessionStorage.getItem('idCliente')
    let idUsuario = sessionStorage.getItem('idUsuario')

    let datos = {
      'idCliente': idCliente,
      'tipo': "1",
      'numeroTarejta': numbertarjeta,
      'nombreTitular': name,
      'vencimiento': expiration,
      'cvv': csv,
      'idUsuario': idUsuario
    }

    axios.post("https://localhost:7010/api/Tarjeta/CrearTarjeta?idUsuariob=" + idUsuario, datos).then((res) => {
      Swal.fire(
        'Guardado',
        'La tarjeta ha sido guardada.',
        'success'
      )

      getTarjetas();
      mostrar(false)


    }

    ).catch((error) => {

      Swal.fire(
        'Error',
        'La tarjeta no ha sido guardada.',
        'error'
      )
      console.log(error);
    }


    );

  }


  const handleCancel = () => {
    mostrar(false)
    getTarjetas()
  }

  const validateNumber = (e) => {

    let valor = e.target.value;
    let ultimoCaracter = valor.substr(valor.length - 1);
    if (isNaN(Number(ultimoCaracter)) && ultimoCaracter != "/") {
      e.target.value = valor.substr(0, valor.length - 1);
    }



    if (e.target.value.length == 2) {
      e.target.value = e.target.value + "/";



    }

    setExpiration(e.target.value);

  }


  const validateNumberCard = (e) => {


    let cardNumber = e.target.value;
    let valor = cardNumber;
    let ultimoCaracter = valor.substr(valor.length - 1);
    if (isNaN(Number(ultimoCaracter))) {
      e.target.value = valor.substr(0, valor.length - 1);
    }

    setNumbertarjeta(e.target.value);

  }

  const validateName = (e) => {


    let valor = e.target.value;
    let ultimoCaracter = valor.substr(valor.length - 1);
    if (!isNaN(Number(ultimoCaracter))) {
      e.target.value = valor.substr(0, valor.length - 1);
    }

    setName(e.target.value);

  }


  return (
    <>
      <div className="creditcard mb-5 mt-5">
        <div className="front">
          <div id="ccsingle"></div>
          <svg version="1.1" id="cardfront" xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 750 471"
            xmlSpace="preserve" style={{ enableBackground: 'new 0 0 750 471' }}>
            <g id="Front">
              <g id="CardBackground">
                <g id="Page-1_1_">
                  <g id="amex_1_">
                    <path id="Rectangle-1_1_" className="lightcolor grey" d="M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40
                        C0,17.9,17.9,0,40,0z" />
                  </g>
                </g>
                <path className="darkcolor greydark"
                  d="M750,431V193.2c-217.6-57.5-556.4-13.5-750,24.9V431c0,22.1,17.9,40,40,40h670C732.1,471,750,453.1,750,431z" />
              </g>
              <text transform="matrix(1 0 0 1 60.106 295.0121)" id="svgnumber" className="st2 st3 st4">

                {numbertarjeta}
              </text>

              <text transform="matrix(1 0 0 1 54.1064 428.1723)" id="svgname" className="st2 st5 st6"> {name} </text>
              <text transform="matrix(1 0 0 1 54.1074 389.8793)" className="st7 st5 st8">Titular de la tarjeta</text>
              <text transform="matrix(1 0 0 1 479.7754 388.8793)" className="st7 st5 st8">Expiración</text>
              <text transform="matrix(1 0 0 1 65.1054 241.5)" className="st7 st5 st8">Número de Tarjeta</text>
              <g>
                <text transform="matrix(1 0 0 1 574.4219 433.8095)" id="svgexpire"
                  className="st2 st5 st9">{expiration}</text>
                <text transform="matrix(1 0 0 1 479.3848 417.0097)" className="st2 st10 st11">VÁLIDA</text>
                <text transform="matrix(1 0 0 1 479.3848 435.6762)" className="st2 st10 st11">HASTA</text>
                <polygon className="st2" points="554.5,421 540.4,414.2 540.4,427.9 		" />
              </g>
              <g id="cchip">
                <g>
                  <path className="st2" d="M168.1,143.6H82.9c-10.2,0-18.5-8.3-18.5-18.5V74.9c0-10.2,8.3-18.5,18.5-18.5h85.3
                    c10.2,0,18.5,8.3,18.5,18.5v50.2C186.6,135.3,178.3,143.6,168.1,143.6z" />
                </g>
                <g>
                  <g>
                    <rect x="82" y="70" className="st12" width="1.5" height="60" />
                  </g>
                  <g>
                    <rect x="167.4" y="70" className="st12" width="1.5" height="60" />
                  </g>
                  <g>
                    <path className="st12" d="M125.5,130.8c-10.2,0-18.5-8.3-18.5-18.5c0-4.6,1.7-8.9,4.7-12.3c-3-3.4-4.7-7.7-4.7-12.3
                        c0-10.2,8.3-18.5,18.5-18.5s18.5,8.3,18.5,18.5c0,4.6-1.7,8.9-4.7,12.3c3,3.4,4.7,7.7,4.7,12.3
                        C143.9,122.5,135.7,130.8,125.5,130.8z M125.5,70.8c-9.3,0-16.9,7.6-16.9,16.9c0,4.4,1.7,8.6,4.8,11.8l0.5,0.5l-0.5,0.5
                        c-3.1,3.2-4.8,7.4-4.8,11.8c0,9.3,7.6,16.9,16.9,16.9s16.9-7.6,16.9-16.9c0-4.4-1.7-8.6-4.8-11.8l-0.5-0.5l0.5-0.5
                        c3.1-3.2,4.8-7.4,4.8-11.8C142.4,78.4,134.8,70.8,125.5,70.8z" />
                  </g>
                  <g>
                    <rect x="82.8" y="82.1" className="st12" width="25.8" height="1.5" />
                  </g>
                  <g>
                    <rect x="82.8" y="117.9" className="st12" width="26.1" height="1.5" />
                  </g>
                  <g>
                    <rect x="142.4" y="82.1" className="st12" width="25.8" height="1.5" />
                  </g>
                  <g>
                    <rect x="142" y="117.9" className="st12" width="26.2" height="1.5" />
                  </g>
                </g>
              </g>
            </g>

          </svg>
        </div>

      </div>

      <form className="form-horizontal" role="form" onSubmit={(e) => handleSubmit(e)}>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label for="cardName">Titular de la tarjeta</label>
              <input type="text" className="form-control" id="cardName" placeholder="Ingrese el nombre" required maxLength="20" value={name} onChange={(e) => setName(e.target.value)}
                onKeyUp={(e) => validateName(e)}

              />

            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Número de Tarjeta</label>
              <div className="input-group mb-3">
                <input type="text" id="cardNumber" className="form-control" placeholder="Ingrese el número de su tarjeta" required autofocus minLength="16" maxLength="16" value={numbertarjeta} onChange={(e) => setNumbertarjeta(e.target.value)}
                  onKeyUp={(e) => validateNumberCard(e)}

                />
              </div>

            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label >Fecha de expiración</label>
              <input type="text" class="form-control" placeholder="MM / YY" id="expiration" required maxLength="5" value={expiration} onChange={(e) => setExpiration(e.target.value)}
                onKeyUp={(e) => validateNumber(e)} minLength="5" />

            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="cardCVC">CVC</label>
              <input type="password" id="CSV" class="form-control" formControlName="cardCVC" placeholder="CVC" required maxLength="3" minLength="3" value={csv} onChange={(e) => setCsv(e.target.value)} />

              <small class="form-text text-muted">Últimos 3 dígitos de su tarjeta.</small>
            </div>
          </div>
          <div class="col-md-6 mx-auto">
            <div>
              <button id="btn" class="btn btn-dark mt-2" type="submit">Guardar</button>
            </div>
            <div>
              <button id="btn" class="btn btn-danger mt-2" type="submit" onClick={() => handleCancel()}>Cancelar</button>
            </div>
            <br />
            <small class="form-text text-muted">Al dar clic, usted está aceptando nuestros términos y condiciones de privacidad.</small>
          </div> 
        </div>
      </form>

    </>
  )
}

export default FormTarjeta