Utilizo una arquitectura desacoplada donde el Frontend (Cliente) se comunica con el Backend (Servidor API REST) mediante el protocolo HTTP utilizando formato JSON para los datos.

## Diagrama de Arquitectura de Componentes

```mermaid
graph LR
    subgraph Frontend [Cliente - Interfaz Web]
        A[index.html + Bootstrap] -->|Acciones de Usuario| B[app.js]
    end

    subgraph Backend [Servidor - Spring Boot]
        C[AuthController]
        D[PedidoController]
        E[PedidoService]
    end

    subgraph Almacenamiento [Persistencia RAM]
        F[(ArrayList en Memoria)]
    end

    B -->|1. POST / GET con JSON| C
    B -->|2. POST / GET / PUT con JSON| D
    D -->|Gestiona Datos| E
    E -->|Guarda / Lee| F