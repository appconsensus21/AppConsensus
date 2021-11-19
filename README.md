![AppConsensus](https://github.com/appconsensus21/AppConsensus/blob/main/src/assets/AppConsensus.png)

## Introducción
*AppConsensus* es una aplicación web desarrollada con [Angular CLI](https://github.com/angular/angular-cli) version 11.1.2. para consensos grupales sobre la evaluación de productos o servicios utilizando conjuntos flexibles de atributos. *AppConsensus* permite generar procesos de consenso, observar avances de un proceso de consenso, evaluar productos o servicios y mostrar sugerencias.

La versión actual de *AppConsensus* consta de tres módulos principales: *administrador*, *moderador* y *participante*; y dos módulos secundarios: *auth* y *shared*.

## Requerimientos

*AppConsensus* requiere de las siguientes tecnologías para su funcionamiento local.

- NodeJS 12.19.0 
- Angular CLI 11.1.2
- Proyecto de Firebase en plan Blaze
- Firebase CLI

Para mayor información sobre la instalación de estas tecnologías consultar el [Manual de Instalación](https://github.com/appconsensus21/AppConsensus/blob/main/manuales/ManualdeInstalacion.pdf)

## Licencia

AppConsensus se publica bajo la licencia de [Apache License, Version 2.0](LICENSE).

## Empezando con AppConsensus

### Clonar el repositorio

```shell
git clone https://github.com/appconsensus21/AppConsensus
```

### Creación de proyecto en Firebase

Para poder crear un proyecto en la plataforma de [Firebase](https://firebase.google.com/) es necesario contar con una cuenta de Google, además es necesario tener una sesión activa de la Cuenta Google para acceder a la página inicial de la consola de Firebase.

### Configuración de Firebase en la aplicación

En la ruta src/environments/config se encuentra el archivo [firebaseConfig](https://github.com/appconsensus21/AppConsensus/blob/main/src/environments/config/firebaseConfig.ts), donde se debe colocar la configuración que Firebase proporciona en el proyecto creado en el paso anterior. Adicional es necesario crear la colección de "usuario" en la base de datos para colocar al usuario Administrador de la aplicación, para esto adjuntamos el [Manual de configuración de Proyecto Firebase](https://github.com/appconsensus21/AppConsensus/blob/main/manuales/ManualConfiguracionProyectoFirebase.pdf)

### Configuración de Funciones de Firebase en la aplicación

En la ruta functions el archivo [.env](https://github.com/appconsensus21/AppConsensus/blob/main/functions/.env) se debe colocar el correo electrónico de gmail y contraseña correspondientes para enviar las diversas notificaciones a los usuarios. Adicional se debe configurar la dirección web de la aplicación.

### Instalación de dependencias de la aplicación

1.	La aplicación tiene algunas librerías externas que complementan su funcionalidad y para levantar un ambiente local de trabajo es necesario instalar estas dependencias para que la aplicación funcione en un ambiente local. Para realizar esto se abre a una consola de comandos que tenga de ubicación la carpeta principal del código fuente (mismo nivel que la carpeta src). Una vez abierta la consola se procede a ejecutar el comando para instalar los paquetes `npm` descritos en el `package.json` y verificar su funcionamiento:
```shell
npm i
```
Este comando va a instalar todos los módulos y librerías que necesita la aplicación para ejecutarse.

### Instalación de Firebase Tools

Ejecuta el siguiente comando para instalar la CLI a través de npm:
```shell
npm install -g firebase-tools
```

### Instalación de dependencias de la carpeta de funciones de firebase

La aplicación utiliza el módulo de funciones disponibles en la plataforma de firebase y para poder activar y utilizar este módulo se comienza haciendo un login con la cuenta corresponiente de Firebase:
```shell
firebase login
```
La guía de instalación y autenticación de Firebase CLI se puede encontrar en la [Documentación de Firebase](https://firebase.google.com/docs/cli).

Seguido a esto se procede a inicializar el módulo Functions de firebase con el siguiente comando:
```shell
firebase init functions
```
Es importante no sobrescribir ningún archivo de la carpeta *functions* ya que cualquier cambio afectaría directamente el funcionamiento de la aplicación. Además el lenguaje a utilizar es *Javascript* y se selecciona que se quiere instalar las dependencias con el comando npm en ese momento.

Finalmente se ejecuta el siguiente comando para implementar las funciones desarrolladas:
```shell
firebase deploy --only functions
```

### Ejecutar la aplicación en ambiente local

1.	Para que la aplicación se ejecute de manera local en el equipo en el cual se descargó es necesario ejecutar el comando: 
```shell
ng serve
``` 
Es importante que el comando se ejecute en una consola de comandos con la ubicación de la carpeta principal del código fuente (mismo nivel que la carpeta src).

2.	Se ingresa en un buscador web la dirección http://localhost:4200/. Y la aplicación se recargará automáticamente y se mostrará en la pantalla del buscador.
