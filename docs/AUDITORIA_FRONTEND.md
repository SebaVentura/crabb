# Auditoría frontend Crabb

## Objetivo
Relevar el frontend existente para diseñar un backend Laravel profesional.

## Stack detectado
- **Framework:** React
- **Librerías:** react, react-dom, react-router-dom
- **Router:** react-router-dom
- **Estado:** Local (useState, useMemo), sin store global
- **Estilos:** TailwindCSS
- **Build tool:** Vite

## Pantallas detectadas
| Ruta | Componente | Descripción | Requiere auth |
|---|---|---|---|
| / | LandingPage | Landing institucional, acceso y beneficios | No |
| /login | LoginPage | Formulario de login (mock) | No |
| /dashboard | DashboardPage (en AppShell) | Panel institucional, estado de cuota, accesos rápidos | Sí (mock) |
| /institucional | InstitucionalPage (en AppShell) | Info institucional, autoridades, socios, beneficios | Sí (mock) |
| /capacitaciones | CapacitacionesPage (en AppShell) | Calendario, próximas capacitaciones, inscripción (mock), histórico | Sí (mock) |
| /data-tecnica | DataTecnicaPage (en AppShell) | Buscador técnico, filtros, resultados (mock) | Sí (mock) |
| /perfil | PerfilSocioPage (en AppShell) | Gestión de socios: alta, edición, baja, filtros, tabla | Sí (mock) |

## Entidades candidatas
| Entidad | Campos visibles | Pantallas donde aparece | Observaciones |
|---|---|---|---|
| Socio | nombreRazonSocial, cuitODni, telefono, email, direccion, localidad, estado, estadoCuota, fechaAlta, fechaUltimoPago, montoCuota, observaciones | PerfilSocioPage, InstitucionalPage, DashboardPage | Mock, hardcodeado |
| Capacitacion | id, titulo, fecha, modalidad, costo | CapacitacionesPage | Mock, hardcodeado |
| Autoridad | cargo, nombre | InstitucionalPage | Mock, hardcodeado |
| Objetivo | texto | InstitucionalPage | Mock, hardcodeado |
| Beneficio | texto | InstitucionalPage | Mock, hardcodeado |
| ResultadoTecnico | id, diagnostico, sintoma, codigo, sistema, causas, solucion, marca, modelo | DataTecnicaPage | Mock, hardcodeado |

## Formularios detectados
| Pantalla | Campos | Acción esperada | Validaciones |
|---|---|---|---|
| LoginPage | email, password | Login (mock, navega a dashboard) | Email requerido y formato, password requerido |
| PerfilSocioPage | nombreRazonSocial, cuitODni, telefono, email, direccion, localidad, estado, estadoCuota, fechaAlta, fechaUltimoPago, montoCuota, observaciones | Alta/edición socio (mock, local) | Requeridos: nombre, cuit/dni, email (formato), montoCuota numérico |
| DataTecnicaPage | query, marca, modelo, sistema, filtroSintoma, filtroCodigo | Filtros de búsqueda (mock) | Ninguna (solo búsqueda local) |

## Endpoints candidatos
| Método | Endpoint | Uso | Entidad |
|---|---|---|---|
| GET | /api/socios | Listar socios | Socio |
| POST | /api/socios | Crear socio | Socio |
| PUT | /api/socios/{id} | Actualizar socio | Socio |
| DELETE | /api/socios/{id} | Dar de baja socio | Socio |
| GET | /api/capacitaciones | Listar capacitaciones | Capacitacion |
| POST | /api/capacitaciones/inscribir | Inscribir a capacitación | Capacitacion (inferido) |
| GET | /api/institucional/autoridades | Listar autoridades | Autoridad |
| GET | /api/institucional/objetivos | Listar objetivos | Objetivo |
| GET | /api/institucional/beneficios | Listar beneficios | Beneficio |
| GET | /api/data-tecnica | Buscar resultados técnicos | ResultadoTecnico |
| POST | /api/auth/login | Login | Usuario (inferido) |

## Roles posibles
- Administrador
- Operador
- Socio/taller/cliente

## Módulos backend propuestos
- Auth
- Usuarios y roles
- Talleres / comercios / asociados
- Reparaciones / expedientes / solicitudes (inferido, no implementado)
- Vehículos (inferido, no implementado)
- Clientes (inferido, no implementado)
- Estados del trámite (inferido, no implementado)
- Archivos adjuntos (inferido, no implementado)
- Reportes (inferido, no implementado)
- Configuración institucional

## Datos hardcodeados
- Todos los datos de socios, capacitaciones, autoridades, objetivos, beneficios y resultados técnicos provienen de archivos mock en frontend.
- No hay integración real con backend.

## Próximo paso backend Laravel

### Models sugeridos
- User
- Socio
- Capacitacion
- Autoridad
- Objetivo
- Beneficio
- ResultadoTecnico

### Migrations sugeridas
- users
- socios
- capacitaciones
- autoridades
- objetivos
- beneficios
- resultados_tecnicos

### Controllers sugeridos
- AuthController
- SocioController
- CapacitacionController
- InstitucionalController
- DataTecnicaController

### Form Requests
- LoginRequest
- SocioRequest
- CapacitacionRequest

### Resources
- SocioResource
- CapacitacionResource
- AutoridadResource
- ObjetivoResource
- BeneficioResource
- ResultadoTecnicoResource

### Policies
- SocioPolicy
- CapacitacionPolicy
- (Agregar según roles y permisos)

### Seeders
- SocioSeeder
- CapacitacionSeeder
- AutoridadSeeder
- ObjetivoSeeder
- BeneficioSeeder
- ResultadoTecnicoSeeder

### Orden recomendado de implementación
1. Autenticación y roles
2. Socios (CRUD)
3. Capacitaciones (CRUD e inscripción)
4. Institucional (autoridades, objetivos, beneficios)
5. Data técnica (búsqueda)
6. Políticas de acceso
7. Seeders y datos de prueba
8. Endpoints REST y validaciones
9. Documentación de API

---

> Auditoría generada automáticamente a partir del código fuente frontend. Todo lo marcado como "mock" o "hardcodeado" debe ser reemplazado por lógica real en backend Laravel.