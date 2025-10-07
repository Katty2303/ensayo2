// Mi primer servidor con Express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');


require('dotenv').config();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '..')));


if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('ERROR: Faltan variables de entorno EMAIL_USER y/o EMAIL_PASS');
    console.log('Asegurate de crear el archivo .env con las credenciales de Gmail');
    process.exit(1);
}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  
    }
});


transporter.verify((error, success) => {
    if (error) {
        console.error('ERROR conectando con Gmail:', error.message);
        console.log('Verifica que:');
        console.log('1. Hayas habilitado la verificacion en 2 pasos en Gmail');
        console.log('2. Hayas creado una contraseña de aplicacion');
        console.log('3. Las credenciales en .env sean correctas');


    } else {
        console.log('✓ Servidor listo para enviar correos');
    }
});


app.get('/api/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});


app.get('/api/saludo', (req, res) => {
    res.json({
        mensaje: 'Hola desde tu API!',
        fecha: new Date(),
        servidor: 'Node.js + Express'
    });
});


app.get('/api/usuarios', (req, res) => {
    res.json([
        {id: 1, nombre: 'Ruby'},
        {id: 2, nombre: 'Katherine'}
    ]);
});


app.post('/api/datos', (req, res) => {
    console.log(req.body);
    res.json({mensaje: 'Datos recibidos'});
});


app.post('/api/contact', async (req, res) => {
 
    console.log('=== NUEVA PETICION ===');
    console.log('Datos recibidos:', req.body);
    console.log('Headers:', req.headers);


    const { nombre, email, servicio, presupuesto, asunto, mensaje } = req.body;


        if (!nombre || !email || !servicio || !presupuesto ||!asunto || !mensaje) {
        console.log('ERROR: Faltan campos requeridos');
       
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son requeridos'
        });
    }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log('ERROR: Email invalido');
        return res.status(400).json({
            success: false,
            message: 'Email invalido'
        });
    }


        const mailOptions = {
        from: process.env.EMAIL_USER,                    
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `Nuevo mensaje de ${nombre}: ${asunto}`,  
        html: `
            <h2>Nuevo mensaje desde tu portafolio</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Servicio:</strong> ${servicio}</p>
            <p><strong>Presupuesto:</strong> ${presupuesto}</p>
            <p><strong>Asunto:</strong> ${asunto}</p>
            <p><strong>Mensaje:</strong></p>
            <div style="background: #f5f5f5; padding: 15px; margin: 10px 0; border-left: 4px solid #2563eb;">
                ${mensaje.replace(/\n/g, '<br>')}
            </div>
            <hr>
            <p><small>Este mensaje fue enviado desde tu formulario de contacto el ${new Date().toLocaleString()}</small></p>
        `
    };


        try {
        console.log('Enviando correo...');
   
        const info = await transporter.sendMail(mailOptions);
       


        console.log('✓ Correo enviado exitosamente:', info.messageId);
       


        res.json({
            success: true,
            message: 'Mensaje enviado correctamente'
        });
       
    } catch (error) {
        console.error('ERROR enviando correo:', error);
       
        let errorMessage = 'Error al enviar el mensaje';
       
        if (error.code === 'EAUTH') {
           
            errorMessage = 'Error de autenticacion con Gmail. Verifica las credenciales';
        } else if (error.code === 'ENOTFOUND') {
           
            errorMessage = 'Error de conexion. Verifica tu conexion a internet';
        }
       
        res.status(500).json({
            success: false,
            message: errorMessage,
            debug: error.message
        });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});


app.use((error, req, res, next) => {
    console.error('Error del servidor:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
});


app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`=== SERVIDOR INICIADO ===`);
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Presiona CTRL+C para detener`);
    console.log(`========================`);
});
