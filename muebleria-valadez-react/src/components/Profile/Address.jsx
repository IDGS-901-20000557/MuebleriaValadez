import React from 'react'
// import './address.css'
import axios from 'axios'
const Address = ({ calle, noExt, noInt, cp, colonia, ciudad, estado, id , mostrar,editar,ids,getDirecciones}) => {

    const editarDireccion = (id) => 
    {
        mostrar(true)
        editar(true)
        ids(id)
    }



    const deleteDireccion = (direccionId) => {
        let idCliente = sessionStorage.getItem('idCliente')
        let idUsuario = sessionStorage.getItem('idUsuario')
        Swal.fire({
          title: 'Alerta de confirmación',
          text: "¡No podrá revertir esta acción!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#198754',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
      
      
            let datos = {
              'idUsuario': idUsuario,
              'idCliente': idCliente
            }
      
            axios.post("https://localhost:7010/api/Direccion/deleteAddress?idDireccion=" + direccionId + "&idUsuariob="  + idUsuario, datos).then((res) => {
      
              Swal.fire(
                'Eliminado!',
                'Tu dirección ha sido eliminada.',
                'success'
              )
      
              //window.location.reload();
              getDirecciones();
      
      
            
      
            }).catch((error) => {
      
              console.log(error);
      
            });
      
          }
        })
      
      }


    return (
        <>

            <div className="col-md-12">

                <div className="card mt-2">
                    <a data-bs-toggle="tooltip" data-bs-placement="bottom"
                        data-bs-title="Tooltip on bottom"
                        onClick={() => deleteDireccion(id)}
                     className="mt-3" style ={{ cursor: "pointer", fontSize: "medium" }}>
                        <i className="fas fa-times mx-2 mt-2 float-right" data-toggle="tooltip"
                            data-placement="bottom" title="Eliminar"></i> </a>
                    <div className="card-body">
                        <p className="card-text"><b>Calle:</b> {calle}</p>
                        <p className="card-text"> <b>No. Exterior:</b> {noExt}
                            <b>No. Interior:</b> {noInt}</p>
                        <p className="card-text"><b>C.P.:</b> {cp}
                            <b> Colonia:</b> {colonia}</p>
                        <p className="card-text"><b>Ciudad:</b> {ciudad}
                            <b>Estado:</b>   {estado}</p>
                        <button id="btn" className="btn btn-dark mt-2" onClick={() => editarDireccion(id)}>Editar Direccion</button>
                    </div>
                </div> 
            </div>


        </>
    )
}

export default Address