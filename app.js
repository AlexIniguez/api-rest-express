const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express'); //importamos express
const config = require('config');
const logger = require('./logger');
const morgan = require('morgan');
const Joi = require('joi'); //importa joi
const app = express(); //crea instancia de express
const {ppid} = require('process');

//el midlleware es un bloque de codigo que se ejecuta 
//enre las peticiones del usuario(cliente) y el
//request que llega al sevidor. es un enlace entre la peticion 
//del usuario y del servidor , antes de que este pueda dar una respuesta.

//las funciones de middleware son funciones que tienen acceso 
//al objeto de peticion (request, req), al objeto de respuesta (response, res)
//y a la siguiente funcion de middleware en el ciclo de peticiones/respuestas
//de la aplicacion. la siguiente funcion de middleware se denota
//normalmente con una variable denomindada next

//las funciones de middleware pueden realizar las sifuientes tareas:
//   -ejecutar cualquier codigo
//   -realizar cambios en la posicion y los objetos de respuesta
//   -finalizar el ciclo de peticion/respuesta
//   -invocar la sigueinte funcion de middleware en la pila

//express es un framework de  direcionamiento de uso de middleware
//que permite que la aplicacion tenga funcionalidad minima propia

//ya usamos algunos middleware como express.jason()
//transforma el body del req a formato JSON

//          ------------------------
// request -|-> json() --> route()-|-> response
//          ------------------------

//route() --> Funciones GET, POST, PUT, DELETE

//JSON hace un parsing  de la entrada a formato JSON
//de tal forma que lo recibamos en el req de una peticion este en formato JSON
app.use(express.json()); //se le dice a express que use el middlerware
app.use(express.urlencoded({extended: true})); //otra manera de poder hacer lo mismo que express

app.use(express.static('public'));//public es la carpeta que tendra nuestros recursos estaticos

console.log(`Aplicacion: ${config.get('nombre')}`);
console.log(`DB server: ${config.get('configDB.host')}`);

//uso de middleware de terceros -morgan
if(app.get('env') == 'development'){
    app.use(morgan('tiny'));
    inicioDebug('Morgan esta habilitado...');
}

//operaciones con la base de datos
dbDebug('Conectado a la base de datos...');

//app.use(function(req, res, next){
//  console.log('Logging...'); //--> este es el funcion desde el programa principal
//next(); //sin esto no obtendra una respuesta 
//});

//app.use(logger); //loger ya hace referencia a la funcion log (exports)


//app.use(function (req, res, next) {
  //  console.log('Autenticando...');
    //next();
//});

//query string
//url/?var1=valor1&var2=valor2&var3=valor3

//hay cuatro tipos de peticiones 
//app.get();//consulta de datos 
//app.post();//Envia datos al servidor (inserta datos)
//app.put();//actualiza datos 
//app.delete();//elimina datos

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

//consutla en la ruta raiz de nuestro servidor 
//con una funcion call back
app.get('/', (req, res) => {
    res.send('Hola desde express');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});
//como pasar parametros dentro de las ruta
//p.ejemplo solo quiero un usuario especifico en vez de todos
//con los : delante del parametro id Express
//sabe que es un parametro a recibir
//https://localhost:3000/api/usuarios/1990/2/sex='m'&name='' 




//usando el modulo process, se lee una variable de entorno 
//console.log(process.env)
//si la variable no existe , va a tomar un valor por default (3000)
const port = process.env.PORT || 3000;
//console.log(process.env)

app.listen(3000, () => {
    console.log(`Escuchando en el puerto ${port}...`);
});

function existeUsuario(id) {
    return (usuarios.find(u => u.id === parseInt(id))); //buscara un usuario con esto reemplazaremos codigo en el PUT
}

function validarUsuario(nom) { //hara lo mismo que nuestro metodo PUT, con eso mismo reemplazaremos codigo
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({
        nombre: nom
    }));
}