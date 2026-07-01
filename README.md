# CalcuPrint 🚀

[Español](#español) | [English](#english)

---

## Español

Una calculadora web profesional, elegante y minimalista diseñada para presupuestar costos de impresión 3D (piezas individuales o sets completos) con precisión industrial. Desplegada y funcionando a costo cero, optimizando el rendimiento mediante procesamiento 100% en el frontend.

### ✨ Características Principales

*   **Persistencia Local Automática:** Guarda todas las variables de insumos en el navegador utilizando LocalStorage. Los datos no se borran al cerrar la pestaña o recargar.
*   **Gestión del Tiempo Flexible:** Permite ingresar tiempos de impresión combinando horas y minutos de forma exacta.
*   **Doble Modo de Costeo de Máquina:**
    *   Tarifa Fija por Hora (Recomendado): Unifica luz, amortización de hardware y desgaste en un solo multiplicador horario.
    *   Modo Avanzado:* Calcula el impacto eléctrico exacto ingresando el consumo en Watts de la impresora y el costo del KWh.
*   **Desglose de Costos Detallado:** Computa el peso del filamento, insumos adicionales (tornillos, insertos, pegamento) y el valor de la mano de obra de manera independiente.
*   **Soporte para Sets/Tandas:** Calcula el costo neto de fabricación y sugiere un precio de venta final aplicando un margen de ganancia porcentual dinámico tanto por unidad como por lote.
*   **Interfaz Premium y Responsiva:** Diseño minimalista con una paleta de colores sobria, modo oscuro nativo, bordes redondeados y tipografía pulida.

### 🛠️ Stack Tecnológico

*   React (v18+) - Biblioteca para la interfaz de usuario.
*   Vite - Herramienta de construcción ultra rápida para el entorno de desarrollo.
*   Oxlint - Linter de alto rendimiento escrito en Rust para garantizar la calidad del código en milisegundos.
*   Vercel - Hosting estático automatizado y continuo.

### 🚀 Instalación y Desarrollo Local

Para clonar este proyecto y correrlo en tu máquina, seguí estos pasos:

1. **Clonar el repositorio:**
```bash
git clone [https://github.com/niccgf/calcuprint.git](https://github.com/niccgf/calcuprint.git)
cd calcuprint
```

2. **Instalar las dependencias:**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```
Abrí http://localhost:5173 en tu navegador para ver la app.

4. **Ejecutar el Linter (Oxlint):**
```bash
npm run lint
```

---

## English

A professional, sleek, and minimalist web calculator designed for precise industrial 3D printing cost estimation, handling both individual parts and complete sets. Deployed and running at zero cost, optimizing performance through 100% frontend processing.

### ✨ Key Features

*   **Automatic Local Persistence:** Automatically saves all input variables in the browser using LocalStorage. Data is preserved even after closing the tab or refreshing.
*   **Flexible Time Management:** Allows precise print time entries by combining hours and minutes flawlessly.
*   **Dual Machine Costing Modes:**
    *   Fixed Hourly Rate (Recommended): Unifies electricity, hardware depreciation, and machine wear into a single hourly multiplier.
    *   Advanced Mode:* Calculates the exact electrical footprint by inputting the printer's power consumption in Watts and the local KWh price.
*   **Detailed Cost Breakdown:** Independently computes filament weight, extra supplies (screws, inserts, glue), and labor costs.
*   **Set/Batch Support:** Calculates net manufacturing costs and suggests a final selling price by applying a dynamic markup percentage for both individual units and entire batches.
*   **Premium Responsive Interface:** Minimalist design with a sober color palette, native dark mode, rounded corners, and polished typography.

### 🛠️ Tech Stack

*   React (v18+) - UI Components.
*   Vite - Ultra-fast development environment and build tool.
*   Oxlint - High-performance linter written in Rust to guarantee code quality in milliseconds.
*   Vercel - Automated CI/CD and static hosting.

### 🚀 Installation & Local Development

To clone this project and run it locally, follow these steps:

1. **Clone the repository:**
```bash
git clone [https://github.com/niccgf/calcuprint.git](https://github.com/niccgf/calcuprint.git)
cd calcuprint
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```
Open http://localhost:5173 in your browser to view the app.

4. **Run the Linter (Oxlint):**
```bash
npm run lint
```

---

## 🌐 Deployment / Despliegue

This project is configured for an automated Continuous Integration (CI/CD) pipeline with Vercel. Any change pushed to the main branch of this repository is instantly built and deployed to production at zero cost.

Este proyecto está configurado para un flujo de Integración Continua (CI/CD) con Vercel. Cada cambio impactado en la rama main de este repositorio se compila y publica automáticamente en producción a costo cero.