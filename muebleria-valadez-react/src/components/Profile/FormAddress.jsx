import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'


const FormAddress = ({ mostrar, editar, id, ids, editars, getDirecciones }) => {

    const [estados, setEstados] = useState([])
    const [ciudades, setCiudades] = useState([])
    const [cps, setCps] = useState([])
    const [colonias, setColonias] = useState([])
    const [calle, setCalle] = useState('')
    const [noExt, setNoExt] = useState('')
    const [noInt, setNoInt] = useState('')
    const [estado, setEstado] = useState('')
    const [ciudad, setCiudad] = useState('')
    const [cp, setCp] = useState('')
    const [colonia, setColonia] = useState('')

    const getAddresses = async () => {
        const res = await axios.get('https://localhost:7010/api/Direccion/getAdressbyid?idDireccion=' + id)
        const data = await res.data

        setCalle(data[0].calle)
        setNoExt(data[0].noExt)
        setNoInt(data[0].noInt)
        setEstado(data[0].domicilio.estado)
        setCiudad(data[0].domicilio.ciudad)
        setCp(data[0].domicilio.cp)
        setColonia(data[0].domicilio.idDomicilio)

        await getCiudades(data[0].domicilio.estado)
        await getCp(data[0].domicilio.ciudad)
        await getColonias(data[0].domicilio.cp)


    }

    const getEstados = async () => {
        const res = await axios.get('https://localhost:7010/api/Direccion/getEstados')
        const data = await res.data
        console.log(data)
        setEstados(data)
    }

    const getCiudades = async (name) => {

        const res = await axios.get('https://localhost:7010/api/Direccion/getCiudades?estado=' + name)
        const data = await res.data
        console.log(data)
        setCiudades(data)
    }
    const getCp = async (name) => {
        const res = await axios.get('https://localhost:7010/api/Direccion/getCp?ciudad=' + name)
        const data = await res.data
        console.log(data)
        setCps(data)
    }
    const getColonias = async (name) => {
        const res = await axios.get('https://localhost:7010/api/Direccion/getColonia?cp=' + name)
        const data = await res.data
        console.log(data)
        setColonias(data)
    }

    const handleCancel = () => {
        mostrar(false)
        ids(0)
        editars(false)
    }


    const handleChangueEstado = async (e) => {
        setEstado(e.target.value)
        await getCiudades(e.target.value)
        setCiudad('')
        setCp('')
        setColonia('')

    }

    const handleChangueCiudad = async (e) => {
        setCiudad(e.target.value)
        await getCp(e.target.value)
        setCp('')
        setColonia('')

    }

    const handleChangueCp = async (e) => {
        setCp(e.target.value)
        await getColonias(e.target.value)
        setColonia('')
    }

    const handleChangueColonia = async (e) => {
        setColonia(e.target.value)
    }


    const handleSubmint = (e) => {
        e.preventDefault()
        if (editar === true) {
            handleUpdateAddress()
        } else {
            handleAddAddress()
        }

    }

    const handleAddAddress = async () => {

        let idCliente = sessionStorage.getItem('idCliente')
        let idUsuario = sessionStorage.getItem('idUsuario')
        let int = 0;

        if (noInt !== '') {
            int = noInt
        }

        let data = {
            "calle": calle,
            "noExt": noExt,
            "noInt": int,
            "idDomicilio": parseInt(colonia),
            "idCliente": idCliente

        }

        axios.post("https://localhost:7010/api/Direccion/addAddress?idUsuariob=" + idUsuario, data).then((response) => {

            Swal.fire({
                icon: 'success',
                title: 'Dirección agregada con éxito',
                showConfirmButton: false,
                timer: 1500
            })

            mostrar(false)
            getDirecciones()


        }

        ).catch((error) => {

            Swal.fire({
                title: 'Ocurrió un error',
                text: 'Los datos de su dirección son incorrectos. Intente nuevo',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33'
            });
            console.log(error);

        }
        )

    }

    const handleUpdateAddress = async () => {

        let idCliente = sessionStorage.getItem('idCliente')
        let idUsuario = sessionStorage.getItem('idUsuario')
        let int = 0;

        if (noInt !== '') {
            int = noInt
        }

        let data = {
            "calle": calle,
            "noExt": noExt,
            "noInt": int,
            "idDomicilio": colonia,
            "idCliente": idCliente

        }

        Swal.fire({
            title: 'Alerta de confirmación',
            text: "¿Desea guardar los cambios en el sistema?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

                axios.post("https://localhost:7010/api/Direccion/updateAddress?idDireccion=" + id + "&idUsuariob=" + idUsuario, data).then((response) => {

                    Swal.fire({
                        icon: 'success',
                        title: 'Dirección actualizada',
                        showConfirmButton: false,
                        timer: 1500
                    })

                    mostrar(false)
                    getDirecciones()




                }).catch((error) => {

                    Swal.fire({
                        icon: 'error',
                        title: 'Ocurrió un error',
                        text: '¡Algo salió mal! Intente de nuevo',
                    })

                }

                );


            }

        });

    }


    
    useEffect(() => {
        console.log(id)
        if (id !== 0 && editar === true) {
            getAddresses();
        }
        getEstados()

    }
        , [])

    return (
        <>
            <form className="form-horizontal" role="form" onSubmit={(e) => handleSubmint(e)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label for="calle">Calle</label>
                            <input type="text" className="form-control" id="calle" formControlName="calle" placeholder="Calle" required value={calle} onChange={(e) => setCalle(e.target.value)} />

                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label for="noExt" className="mt-2">Número Exterior</label>
                            <input type="number" className="form-control" id="noExt" formControlName="noExt"
                                placeholder="Número Exterior" value={noExt} onChange={(e) => setNoExt(e.target.value)} />

                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label for="noInt" className="mt-2">Número Interior</label>
                            <input type="number" className="form-control" id="noInt" formControlName="noInt"
                                placeholder="Número Interior" value={noInt} onChange={(e) => setNoInt(e.target.value)} />

                        </div>
                    </div>
                    <div className="col-md-6" >
                        <div className="form-group">
                            <label for="estado" className="mt-2">Estado</label>
                            <select type="text" className="form-control" id="estado" formControlName="estado" placeholder="Estado" required value={estado} onChange={(e) => handleChangueEstado(e)}>
                                <option value="" disabled>Seleccione</option>
                                {estados.map((estado) => (
                                    <option key={estado} value={estado}>{estado}</option>
                                ))}

                            </select>

                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label for="ciudad" className="mt-2">Ciudad</label>
                            <select type="text" className="form-control" id="ciudad" formControlName="ciudad" placeholder="Ciudad" required value={ciudad} onChange={(e) => handleChangueCiudad(e)}>
                                <option value="" disabled>Seleccione</option>
                                {ciudades.map((ciudad) => (
                                    <option key={ciudad} value={ciudad}>{ciudad}</option>
                                ))}

                            </select>


                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label for="cp" className="mt-2">Código Postal</label>
                            <select type="text" className="form-control" id="cp" formControlName="cp" placeholder="Código Postal" required value={cp} onChange={(e) => handleChangueCp(e)}>
                                <option value="" disabled>Seleccione</option>
                                {cps.map((cp) => (

                                    <option key={cp} value={cp}>{cp}</option>
                                ))}

                            </select>


                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label for="colonia" className="mt-2">Colonia</label>
                            <select type="text" className="form-control" id="colonia" formControlName="colonia" placeholder="Colonia" required value={colonia} onChange={(e) => handleChangueColonia(e)}>
                                <option value="" disabled>Seleccione</option>
                                {colonias.map((colonia) => (
                                    <option key={colonia.idDomicilio} value={colonia.idDomicilio}>{colonia.colonia}</option>
                                ))}

                            </select>


                        </div>
                    </div>


                    <div class="col-md-6 mx-auto">
                        {editar ?
                            <div>
                                 <button className="btn btn-dark btn-block mt-4 mb-2" type="submit">Actualizar</button>
                            </div> :
                            <div>
                                <button className="btn btn-dark mt-4 mb-2" type="submit" >Agregar</button>
                            </div>}


                        <button className="btn btn-danger mt-2" onClick={() => handleCancel()}>Cancelar</button>

                        <small className="form-text text-muted">Al dar clic, usted está aceptando nuestros términos y condiciones de privacidad.</small>
                    </div>
                </div>
            </form>


        </>
    )
}

export default FormAddress