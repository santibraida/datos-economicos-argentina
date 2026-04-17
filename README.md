# Datos Económicos Argentina

API para obtener cotizaciones del dólar, euro, real brasileño, indicadores del BCRA, riesgo país e historial de precios. Construida con Next.js.

## Endpoints

### Cotizaciones

| Método | Endpoint                 | Descripción                               |
| ------ | ------------------------ | ----------------------------------------- |
| GET    | /api/quotes              | Todas las cotizaciones disponibles        |
| GET    | /api/quotes/dollar       | Todas las cotizaciones del dólar          |
| GET    | /api/quotes/dollar/:type | Cotización de un tipo de dólar específico |
| GET    | /api/quotes/euro         | Cotización oficial del euro               |
| GET    | /api/quotes/euro/:bank   | Cotización del euro por banco (`oficial`) |
| GET    | /api/quotes/real         | Cotización oficial del real brasileño     |
| GET    | /api/quotes/real/:bank   | Cotización del real por banco (`oficial`) |

**Tipos de dólar disponibles para `:type`:** `oficial`, `blue`, `bolsa`, `contadoconliqui`, `mayorista`, `cripto`, `tarjeta`

---

### Evolución mensual

| Método | Endpoint                    | Descripción                          |
| ------ | --------------------------- | ------------------------------------ |
| GET    | /api/evolution/dollar/:type | Evolución mensual del dólar por tipo |
| GET    | /api/evolution/euro         | Evolución mensual del euro oficial   |
| GET    | /api/evolution/real         | Evolución mensual del real oficial   |

**Tipos de dólar disponibles para `:type`:** `oficial`, `blue`, `bolsa`, `contadoconliqui`, `mayorista`, `cripto`, `tarjeta`

---

### Historial de precios

| Método | Endpoint                  | Descripción                                    |
| ------ | ------------------------- | ---------------------------------------------- |
| GET    | /api/history/dollar/:type | Historial del dólar por tipo                   |
| GET    | /api/history/cer          | Historial del CER                              |
| GET    | /api/history/ipc          | Historial del IPC (inflación mensual)          |
| GET    | /api/history/uva          | Historial del UVA                              |
| GET    | /api/history/\*           | Historial almacenado en DB por tipo (paginado) |

**Query params:**

- `granularity`: `monthly` (default) o `daily` — disponible en `/history/dollar/:type`, `/history/cer`, `/history/uva`
- `limit`: cantidad de meses (máx. 120) — disponible en `/history/ipc`
- `page` / `limit`: paginación — disponible en `/history/*`

---

### Indicadores

| Método | Endpoint                     | Descripción                       |
| ------ | ---------------------------- | --------------------------------- |
| GET    | /api/indicators/bcra/:type   | Indicador del BCRA por tipo       |
| GET    | /api/indicators/country-risk | Riesgo país                       |
| GET    | /api/indicators/inflacion    | Evolución mensual de la inflación |

**Tipos disponibles para `:type` en `/indicators/bcra`:**
`reservas`, `tcMinorista`, `tcMayorista`, `badlar`, `tm20`, `tasaDepositos30d`, `tasaPrestamosPersonales`, `baseMon`, `circulante`, `depositosPlazo`, `prestamosPrivado`, `ipcInteranual`, `expectativaInflacion`, `cer`, `uvaAlternativo`, `icl`, `tamar`, `inflacion`, `uva`

---

## Respuestas

**Cotización** (`/api/quotes/...`):

```json
{
  "date": "2026-04-17T12:00:00.000Z",
  "buy": "1230.00",
  "sell": "1250.00",
  "currency": "USD"
}
```

**Indicador** (`/api/indicators/...`):

```json
{
  "date": "2026-04-17T12:00:00.000Z",
  "type": "reservas",
  "value": "27500",
  "lastUpdate": "2026-04-16"
}
```

**Evolución** (`/api/evolution/...`):

```json
{
  "date": "2026-04-17T12:00:00.000Z",
  "type": "blue",
  "months": [
    { "year": "2025", "month": "1", "value": "1050.00" },
    { "year": "2025", "month": "2", "value": "1080.00" }
  ]
}
```

**Historial** (`/api/history/...`):

```json
{
  "type": "dollar/blue",
  "date": "2026-04-17T12:00:00.000Z",
  "granularity": "monthly",
  "points": [
    { "fecha": "2025-01", "valor": 1050.0 },
    { "fecha": "2025-02", "valor": 1080.0 }
  ]
}
```

---

Si encontrás algún error o tenés alguna sugerencia, podés abrir un Issue o un Pull Request para contribuir.
