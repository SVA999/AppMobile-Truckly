# Truckly — App Híbrida de Gestión de Flota

Implementación en **React + Vite + TypeScript** de las pantallas del flujo del
dueño del archivo de Figma [`Truckly`](https://www.figma.com/design/9ubJPOlPzAKEJSwMpRlt6H/kalvo).

La app **no requiere conexión a internet**: no hace ninguna llamada de red, la
tipografía y los iconos van empaquetados, los datos viven en `localStorage`

## Pantallas

| Ruta | Pantalla | Frame de Figma |
| --- | --- | --- |
| `/` | Dashboard del Dueño | `41:1576` (adaptado) |
| `/flota` | Lista de Flota (Completa) | `79:263` |
| `/flota/nuevo` | Registrar Camión | `41:2717` (adaptado) |
| `/flota/:id` | Perfil del Camión | `41:1779` (adaptado, con edición) |
| `/documentos` | Actualización de Documentos | `41:2407` (adaptado, agrupado por camión) |
| `/perfil` | Perfil | básico, sin sesión ni autenticación |

## ---

## Paleta de marca

| Token | Valor | Uso |
| --- | --- | --- |
| `--c-primary` | `#F98513` Habañero | CTA, estados activos, iconos clave |
| `--c-secondary` | `#223382` Deep Space Royal | Navbars, marca, botones secundarios |
| `--c-accent` | `#9BACD8` Aster Flower Blue | Bordes, hover, seleccionado, tags |
| `--c-bg` | `#F4F1EC` Luster White | Fondo principal |
| `--c-fill-muted` | `#DAD1C8` Jodhpur Tan | Divisores, tarjetas secundarias |
| `--c-ink` | `#111144` Deadly Depths | Texto principal |
| `--c-danger` | `#BA1A1A` | Documentos vencidos (semántico, fuera de marca) |

## Datos y edición

- Todo vive en `localStorage`; "Restablecer datos de demostración" (en Perfil)
  vuelve a los datos semilla.
- **Editar Datos** en el perfil del camión permite cambiar marca, modelo, año,
  capacidad, tipo de carrocería y **estado** (dropdown) sin recargar.
- **Registrar Camión** exige los 4 documentos legales con fecha de vencimiento
  no anterior a hoy, y valida placa/marca/modelo (sin símbolos), año (1980 —
  año actual + 1) y capacidad (0.1 — 80 toneladas) antes de guardar.
- **Actualización de Documentos** agrupa por camión y marca en rojo las
  tarjetas con al menos un documento vencido.

## Comandos

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```
