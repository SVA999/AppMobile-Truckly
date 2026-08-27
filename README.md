# Truckly — App Híbrida de Gestión de Flota

Implementación en **React + Vite + TypeScript** de las pantallas del flujo del
dueño del archivo de Figma
[`Truckly`](https://www.figma.com/design/9ubJPOlPzAKEJSwMpRlt6H/kalvo).

La app **no requiere conexión a internet**: no hace ninguna llamada de red, la
tipografía y los iconos van empaquetados en el bundle y los datos viven en
`localStorage`.

## Estructura del repositorio

El código de la aplicación está en la carpeta **`trucklyApp/`**:

```
trucklyApp/
├── index.html
├── vite.config.ts            base './' + plugin de React
├── package.json
└── src/
    ├── main.tsx              Punto de entrada: fuentes, router, provider
    ├── App.tsx               Tabla de rutas
    ├── styles/               SASS: parciales + entrada global
    │   ├── _tokens.scss      Mapas SASS de escalas -> custom properties (@each)
    │   ├── _global.scss      Reset + escalas tipográficas
    │   ├── _mixins.scss      Mixins compartidos (surface, control-row)
    │   └── main.scss         Entrada: @use de los parciales (la importa main.tsx)
    ├── components/
    │   ├── icons/            Vectores (paths.ts) + Icon.tsx
    │   ├── layout/           AppShell, TopAppBar, BottomNav, RouteProgress
    │   └── ui/               Card, Button, Badge, Chip, Field, SearchInput
    ├── data/                 Modelo de dominio + estado de la flota (localStorage)
    └── screens/              Una carpeta por pantalla (.tsx + .scss)
```

Los estilos usan **SASS** (`sass` como dependencia de desarrollo; Vite lo compila
sin configuración extra). `styles/` contiene los **parciales** (`_tokens.scss`,
`_global.scss`, `_mixins.scss`) que `main.scss` reúne con `@use`; cada pantalla y
componente tiene su propio `.scss`.

## Ejecución

```bash
cd trucklyApp
```

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

- `npm run dev` — servidor de desarrollo.
- `npm run build` — genera `trucklyApp/dist/` con todo el contenido incrustado
  (JS + CSS minificados, fuentes e iconos). Ese `dist/` es el que se usa para
  crear el instalador.
- `npm run preview` — sirve el `dist/` ya generado.

## Pantallas

| Ruta | Pantalla | Frame de Figma |
| --- | --- | --- |
| `/` | Dashboard del Dueño | `41:1576` (adaptado) |
| `/flota` | Lista de Flota (Completa) | `79:263` |
| `/flota/nuevo` | Registrar Camión | `41:2717` (adaptado) |
| `/flota/:id` | Perfil del Camión | `41:1779` (adaptado, con edición) |
| `/documentos` | Actualización de Documentos | `41:2407` (adaptado, agrupado por camión) |
| `/perfil` | Perfil | básico, sin sesión ni autenticación |

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

- Todo vive en `localStorage`. La app arranca con la flota vacía; "Borrar datos"
  (en Perfil) elimina todos los camiones guardados en el dispositivo.
- **Editar Datos** en el perfil del camión permite cambiar marca, modelo, año,
  capacidad, tipo de carrocería y **estado** (dropdown) sin recargar.
- **Registrar Camión** exige los 4 documentos legales con fecha de vencimiento
  no anterior a hoy, y valida placa/marca/modelo (sin símbolos), año (1980 —
  año actual + 1) y capacidad (0.1 — 80 toneladas) antes de guardar.
- **Actualización de Documentos** agrupa por camión y marca en rojo las
  tarjetas con al menos un documento vencido.
