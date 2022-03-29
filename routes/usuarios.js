const express = requiere('express');
const ruta = express.Router();

const usuarios = [{
    id: 1,
    nombre: 'Bella'
},
{
    id: 2,
    nombre: 'Isabella'
},
{
    id: 3,
    nombre: 'Mina'
},
{
    id: 4,
    nombre: 'Minerva Concepcion'
}
];

ruta.get('/api/usuarios/:id', (req, res) => {
    //devuelve el primer elemento del arreglo  que cumpla con un predicado 
    //parseInt hace el casteo a entero directamente
    let usuario = existeUsuario(req.params.id); //usuarios.find(u => u.id === parseInt(req.params.id)); //-->reemplzamos esto para buscar el id de un usuario
    if (!usuario)
        res.status(404).send('El usuario no se encuentra'); //devuelve el estado HTTP
        res.send(usuario);
});

//tiene el mismo nombre  que la peticion GET 
//express hace la diferencia dependiendo del tipo de peticion
ruta.post('/api/usuarios', (req, res) => {
    const schema = Joi.object({ //-->al igual que en el PUT, reemplazaremos este codigo con nuestra funcion 
        nombre: Joi.string().min(3).required()
    });
    const {
        value,
        error
    } = validarUsuario(req.body.nombre); //schema.validate({nombre:req.body.nombre}); //-->Lo mismo que arriba
    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: req.body.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    } else {
        const mensaje = error.details[0].message
        res.status(400).send(mensaje);
    }

    //console.log(value, error); //para ver los errores desde la consola de VSC
    //el objeto req tiene una propiedad body
    //if(!req.body.nombre || req.body.nombre.length <= 2){//comprobamos que el existe el nombre
    //y que sea un nombre que tenga al menos 2 letras
    //  res.status(400).send('Debe ingresar un nombre que tenga al menos 3 letras');
    //return;
    //}
});

/********Peticion PUT********/
//metodo para actualizar informacion
//recibe el id del usuario que se quiere modificar
//utilizando un paramtero en la ruta :id
ruta.put('/api/usuarios/:id', (req, res) => {
    //validar que el usuario se encuentre en los registros
    let usuario = existeUsuario(req.params.id); //usuarios.find(u => u.id === parseInt(req.params.id)); <--codigo reemplazado con la funcion existeUsuario
    if (!usuario) {
        res.status(404).send('El usuario no se encuentra'); //devuelve el estado HTTP
        return;
    }
    //en el body del request debe venir la informacion para hacer la actualizacion

    //validar que el nombre con las condiciones
    //const schema = Joi.object({      //-->codigo que se reemplaza
    //  nombre:Joi.string().min(3).required()
    //});

    //el objeto req tiene la propiedad body
    const {
        value,
        error
    } = validarUsuario(req.body.nombre); //schema.validate({nombre:req.body.nombre}); //-->codgio que se reemplaza
    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }
    //actualiza el nombre del usuario
    usuario.nombre = value.nombre;
    res.send(usuario);
});
/********Peticion DELETE********/
//es un metodo para eliminar informacion 
//recibe el ud del usuario que se quiere eliminar 
//utilizando un parametro en la ruta :id

ruta.delete('/api/usuarios/:id', (req, res) => {
    const usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no se encuentra');
        return;
    }
    //encontrar el indice del usuario dentro del arreglo 
    //devuelve el indice de la primera ocurrencia del elemento 
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1); //elimina el elemento en le indice indicado
    res.send(usuario); //responde con el usuario eliminado 
});