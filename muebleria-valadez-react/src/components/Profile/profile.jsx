import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./profile.css";
import axios from "axios";
import Tarjeta from "./Tarjeta";
import Address from "./Address";
import FormProfile from "./formProfile";
import FormAddress from "./FormAddress";
import FormTarjeta from "./FormTarjeta";

const profile = () => {

  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tarjetas, setTarjetas] = useState([]);
  const [cliente, setCliente] = useState(1);
  const [direcciones, setDirecciones] = useState([]);
  const [userData, setUserData] = useState([]);
  const [mostrar, setMostrar] = useState(false);
  const [editar, setEditar] = useState(false);
  const [id, setId] = useState(0);

  const getTarjetas = async () => { 
    let clientelocal = sessionStorage.getItem("idCliente");

    const res = await axios.post(
      "https://localhost:7010/api/Tarjeta/GetTarjetas?id=" + clientelocal
    );
    setTarjetas(res.data.data);
    setCliente(clientelocal);
  };

  const getDataUser = async () => {
    let idUsuario = 0;
    if (sessionStorage.getItem("idUsuario") != undefined) {
      idUsuario = sessionStorage.getItem("idUsuario");
    }
    const rest = await axios.get(
      "https://localhost:7010/user/User/user?id=" + idUsuario
    );

    console.log(rest.data);

    setUserData(rest.data[0]);
  };

  const getDirecciones = async () => {

    let clientelocal = sessionStorage.getItem("idCliente");
    const res = await axios.get(

      "https://localhost:7010/api/Direccion/getClienteDirecciones?idCliente=" + clientelocal
    );


    setDirecciones(res.data);


  };

  const handleCancel = () => {
    setMostrar(false)
    setId(0)
    setEditar(false)
}

  useEffect(() => {
    getTarjetas();
    getDataUser();
    getDirecciones();
  }, []);

  return (
    <>
      

        <div className="containerpr">
          <div className="row">
            <div className="col-md-12 mt-4">
              <div className="profile-head">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-4 col-sm-4 col-xs-4">
                      <div className="card tarjeta2 text-center">
                        <img
                          className="rounded mx-auto d-block"
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAYFBMVEX///8AAADw8PA0NDTCwsLGxsb4+Pj19fXW1tZ7e3ucnJwpKSkxMTHJycm6urqvr69ra2tgYGAgICCHh4c5OTmoqKjj4+NMTEzQ0NA/Pz8SEhJVVVUZGRnc3NyTk5NlZWXEd9MwAAACwElEQVRoge2aW7aiMBBFSZSXIE8BxavOf5a30+CCVhpSlQN+mD0A9xKSk6IqjmOKTPLCM/4VFr6btUI8PuK+lSehcLdX+2kueoKt3UEpBo6bqmUViTHxhqsuCFvxSiI3UXtu/qZW7MKkXtvtV82kuyMvj/6K8sOMuidcawVWy+6/pCu467ln/i/NDS0/v6/zGcCP/0hx/2GPlN+Icmj4+jHZHuH2Xrlse6NEySVDLgQq+jRCZoIDyE5/64odRu6x5EJgjt2Aacdsuj3Tjkkca7d2a/8eu2vt1k4A01Owdmv/NnvCtCcQ+4NpzwBueWHKhbiYN7LubLkQd2M77yOuw/xTjltbKMzPmdrAbv4RLXdseQxon3I3nBC5uZzVNulANE+4UYdpWvKXHaJlyW1dgJoXV6a8QcjZyw7TsUuZdkyn/LM9K2d6ErMEImsUvIMGU9o4jv/DkP/AmtSc8uaCkn+2Q8568bjZCH0wggn5HnrYXnFyRmmJmg0oauqea6EjYeqqx614hU8aRYoWPIumDSPh10BCgjxEyx2p/+zbFa5BRMvanggvdwpte4GXS/0tv8KTp2Q9/O6BcybYz3A75YMKVVQNUOpq/K0TyjGHPOA6Ppt1lBYGaPQ+QKsvsI9e6sdsR4QMHMpL7wC++lo/458UuNKK07rBJQ6newErqQmFxQDsoOP1zECP3md2DxB1rVfRF3xHURn3TlJqzoyJzA67hLPexrT8t+/yRzIDF96XRcDtUb5ypV+4qjOQW5HRYlfSj5V5Qv3sgbsJfmkygZvjvuz3DyYbfJ7osBB/Ke8OpS7xXPwkp1XditP/4me/7v9+Ek/1Ec/6N9RNaV6/8wL+zI/DYxx/0GDTY4g/6uV4DP0Nf2+7Nz6m6WoPgymzCTtp7dZu7db+Pfb1K5opTn2Ruf35qnhev5Of0Gfqr/8C4o8vCddFVegAAAAASUVORK5CYII="
                        />
                        <br />
                        <p id="name">{userData.nombres}</p>
                        <p className="titulo">{userData.nombre}</p>
                        <p className="x1">⊖</p>
                        <hr />
                        <p className="x2">⊖</p>
                        <p className="informacion">
                          <b>INFORMACIÓN DE CONTACTO</b>
                        </p>
                        <p className="tarjeta-item">
                          <i className="fas fa-envelope"></i> {userData.email}
                        </p>
                        <p className="tarjeta-item">
                          <i className="fa fa-phone"></i> {userData.telefono}
                        </p>
                      </div>
                    </div>

                    <div
                      className="col-md-8 mt-2 mb-2 col-sm-8 col-xs-8"
                      style={{ minHeight: "800px" }}
                    >
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button
                            className="navbar-infocliente active"
                            id="home-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#home"
                            type="button"
                            role="tab"
                            aria-controls="home"
                            aria-selected="true"
                            onClick={() => handleCancel()}
                          >
                            Información
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="navbar-infocliente"
                            id="profile-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#profile"
                            type="button"
                            role="tab"
                            aria-controls="profile"
                            aria-selected="false"
                            onClick={() => handleCancel()}
                          >
                            Tarjetas
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="navbar-infocliente"
                            id="contact-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#contact"
                            type="button"
                            role="tab"
                            aria-controls="contact"
                            aria-selected="false"
                            onClick={() => handleCancel()}
                          >
                            Contacto
                          </button>
                        </li>
                      </ul>

                      <div className="tab-content" id="myTabContent">
                        <div
                          className="tab-pane fade show active"
                          id="home"
                          role="tabpanel"
                          aria-labelledby="home-tab"
                        >
                          <div className="row">

                            {mostrar ? <> <FormProfile user={userData} mostrar={setMostrar} getDatos={getDataUser} /> </> : <>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label >Nombre</label>
                                        <input type="text" className="form-control" id="txtnombre" required  value={userData.nombres} disabled/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label  className="mt-2">Apellido Paterno</label>
                                        <input type="text" className="form-control" id="txtAPaterno" required  value={userData.apellidoPaterno} disabled/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="mt-2">Apellido Materno</label>
                                        <input type="text" className="form-control" id="txtAMaterno"  required value={userData.apellidoMaterno} disabled/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label  className="mt-2">Teléfono</label>
                                        <input type="text" className="form-control" id="txtTelefono"  required value={userData.telefono} disabled/>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label  className="mt-2">Correo electrónico</label>
                                        <input type="email" className="form-control" id="txtCorreo"  required value={userData.email} disabled/>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label  className="mt-2">Contraseña</label>
                                        <input type="password" className="form-control" id="txtPassword" required value={userData.password} disabled/>
                                    </div>
                                </div>

                                <div className="col-md-6 mx-auto">
                                    <button className="btn btn-dark mt-4" type="submit" onClick={() => setMostrar(true)} >Editar</button>
                                </div>
                            </>
                            }
                           
                          </div>
                        </div>
                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                          <div></div>
                          <div className="row"> 
                            {mostrar ? <> <FormTarjeta mostrar={setMostrar} getTarjetas={getTarjetas}/> </> : <>
                            <div className="card mt-3">
                              <div className="card-body" onClick={() => setMostrar(true)}>
                                <b style={{ cursor: "pointer" }}>
                                  Agregar Tarjeta
                                </b>
                                <a
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "medium",
                                  }}
                                  className="mt-3"
                                >
                                  <i className="fas fa-plus mx-2 mt-2 float-right"></i>
                                </a>
                              </div>
                            </div>
                            
                            {tarjetas.map((tarjeta) => (
                              <div
                                key={tarjeta.idTarjeta}
                                className="col-md-4 mt-3 mt-5 col-sm-4 col-xs-4"
                              >
                                <Tarjeta
                                  numbertarjeta={tarjeta.numeroTarejta}
                                  name={tarjeta.nombreTitular}
                                  expiration={tarjeta.vencimiento}
                                  id={tarjeta.idTarjeta}
                                  getTarjetas={getTarjetas}
                                />
                              </div>
                            ))}
                            </>}
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="contact"
                          role="tabpanel"
                          aria-labelledby="contact-tab"
                          style={{ backgroundColor: "white !important" }}>
                          <div className="row" >
                          {mostrar ? <> <FormAddress mostrar={setMostrar} getDirecciones={getDirecciones} editar={editar} id={id}  ids = {setId} editars={setEditar}/> </> : <>
                            <div className="card mt-3">
                              <div className="card-body" onClick={() => setMostrar(true)}>
                                <b style={{ cursor: "pointer" }}>
                                  Agregar Direccion
                                </b>
                                <a style={{
                                    cursor: "pointer",
                                    fontSize: "medium",
                                  }}
                                  className="mt-3">
                                  <i className="fas fa-plus mx-2 mt-2 float-right"></i>
                                </a>
                              </div>
                            </div>

                            {direcciones.map((direccion) => (
                              <div key={direccion.direccion.idDireccion} className="col-md-6 mt-3">
                                <Address
                                  calle={direccion.direccion.calle}
                                  noExt={direccion.direccion.noExt}
                                  noInt={direccion.direccion.noInt}
                                  cp={direccion.direccion.domicilio.cp}
                                  colonia={direccion.direccion.domicilio.colonia}
                                  ciudad={direccion.direccion.domicilio.ciudad}
                                  estado={direccion.direccion.domicilio.estado}
                                  id={direccion.direccion.idDireccion}
                                  mostrar={setMostrar}
                                  editar={setEditar}
                                  ids = {setId}
                                  getDirecciones={getDirecciones}
                                />
                              </div>
                            ))}
                            </>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </>
  );
};

export default profile;
