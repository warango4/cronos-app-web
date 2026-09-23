# Cronos — web

Versión web de Cronos. React 19 + Vite + Tailwind 4.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # typecheck + build de producción
```

- **Fuentes y paleta:** Nunito y Figtree desde Google Fonts; colores como tokens en `src/index.css` (`@theme`), los mismos que la app móvil.
- **Material Design:** íconos Material Symbols (Google Fonts) y switch M3; el resto de íconos son de `lucide-react`.
- **Flujo:** Lista → Nueva alarma → "Alarma creada" → Compartir → Detalle; Monitorear y Solicitudes desde el menú.
- Los datos viven en memoria (`src/state.tsx`): se reinician al recargar.
