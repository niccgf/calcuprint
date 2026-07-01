import { useState, useEffect } from 'react';

export default function App() {
  // 1. Estado principal de la calculadora (tu configuración de siempre)
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('calculadora_3d_config_v2');
    return saved ? JSON.parse(saved) : {
      precioFilamento: 15000,
      pesoPieza: 50,
      tiempoHoras: 1,
      tiempoMinutos: 30,
      modoMaquina: 'tarifa', 
      tarjetaHoraMaquina: 350, 
      consumoMaquina: 150,
      costoKwh: 120,
      insumosAdicionales: 200, 
      manoObra: 1000,          
      porcentajeGanancia: 50,
      cantidadSet: 5,
      insumosPorTotal: false,
      manoObraPorTotal: false
    };
  });

  // 2. NUEVO ESTADO: Lista de perfiles de máquinas guardados en LocalStorage
  const [perfiles, setPerfiles] = useState(() => {
    const savedPerfiles = localStorage.getItem('calculadora_3d_perfiles_maquinas');
    return savedPerfiles ? JSON.parse(savedPerfiles) : [
      { id: 1, nombre: 'Máquina Estándar', tarifa: 350 } // Un perfil base por defecto
    ];
  });

  // 3. NUEVO ESTADO: Controla el input para escribir el nombre de la nueva máquina
  const [nuevoNombrePerfil, setNuevoNombrePerfil] = useState('');

  // Guardar configuración de la app
  useEffect(() => {
    localStorage.setItem('calculadora_3d_config_v2', JSON.stringify(config));
  }, [config]);

  // NUEVO EFFECT: Guardar los perfiles de las máquinas cuando cambien
  useEffect(() => {
    localStorage.setItem('calculadora_3d_perfiles_maquinas', JSON.stringify(perfiles));
  }, [perfiles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: name === 'modoMaquina' ? value : (parseFloat(value) || 0)
    }));
  };

  const handleCheckboxChange = (name) => {
    setConfig(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // 🛠️ FUNCIONES PARA GESTIONAR PERFILES
  
  // Guardar la tarifa actual con un nuevo nombre de máquina
  const agregarPerfil = (e) => {
    e.preventDefault();
    if (!nuevoNombrePerfil.trim()) return;

    const nuevoPerfil = {
      id: Date.now(),
      nombre: nuevoNombrePerfil.trim(),
      tarifa: config.tarjetaHoraMaquina
    };

    setPerfiles(prev => [...prev, nuevoPerfil]);
    setNuevoNombrePerfil('');
  };

  // Cargar la tarifa de la máquina seleccionada en la calculadora
  const cargarPerfil = (tarifa) => {
    setConfig(prev => ({
      ...prev,
      tarjetaHoraMaquina: tarifa
    }));
  };

  // Borrar una máquina de la lista
  const eliminarPerfil = (id, e) => {
    e.stopPropagation(); // Evita que se dispare la carga al clickear el botón de borrar
    setPerfiles(prev => prev.filter(p => p.id !== id));
  };


  // MATEMÁTICA Y CÁLCULOS (Se mantiene igual que antes)
  const cantidad = Number(config.cantidadSet) || 1;
  const tiempoTotalEnHoras = config.tiempoHoras + (config.tiempoMinutos / 60);
  const costoMaterialPieza = (config.precioFilamento / 1000) * config.pesoPieza;

  const costoMaquinaPieza = config.modoMaquina === 'tarifa'
    ? tiempoTotalEnHoras * config.tarjetaHoraMaquina
    : tiempoTotalEnHoras * (config.consumoMaquina / 1000) * config.costoKwh;

  const costoInsumosUnidad = config.insumosPorTotal ? config.insumosAdicionales / cantidad : config.insumosAdicionales;
  const costoManoObraUnidad = config.manoObraPorTotal ? config.manoObra / cantidad : config.manoObra;
  const costoNetoPieza = costoMaterialPieza + costoMaquinaPieza + costoInsumosUnidad + costoManoObraUnidad;
  const precioVentaPieza = costoNetoPieza * (1 + config.porcentajeGanancia / 100);
  const costoNetoSet = costoNetoPieza * cantidad;
  const precioVentaSet = precioVentaPieza * cantidad;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>CalcuPrint</h1>
        <p style={styles.subtitle}>Calculadora Profesional de Costos de Impresión 3D, by PKS turromantiko :$</p>
      </header>
      
      <div style={styles.layout}>
        {/* COLUMNA DE CONFIGURACIÓN */}
        <section style={styles.card}>
          
          {/* 🖥️ NUEVA SECCIÓN: GESTIÓN DE PERFILES DE MÁQUINAS */}
          <h2 style={styles.sectionTitle}>Perfiles de Impresoras</h2>
          
          <div style={styles.profileSection}>
            <label style={styles.label}>Seleccionar Máquina Guardada:</label>
            <div style={styles.profileList}>
              {perfiles.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => cargarPerfil(p.tarifa)}
                  style={{
                    ...styles.profileItem,
                    borderColor: config.tarjetaHoraMaquina === p.tarifa ? '#3b82f6' : '#475569',
                    backgroundColor: config.tarjetaHoraMaquina === p.tarifa ? '#1e3a8a33' : '#0f172a'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: '600', block: 'block' }}>{p.nombre}</span>
                    <span style={styles.unit}> (${p.tarifa}/hs)</span>
                  </div>
                  {perfiles.length > 1 && (
                    <button onClick={(e) => eliminarPerfil(p.id, e)} style={styles.deleteBtn}>✕</button>
                  )}
                </div>
              ))}
            </div>

            {/* Formulario rápido para guardar la tarifa actual como perfil */}
            <form onSubmit={agregarPerfil} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <input 
                type="text" 
                placeholder="Nombre de la máquina... (Ej: Ender 5)" 
                value={nuevoNombrePerfil} 
                onChange={(e) => setNuevoNombrePerfil(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button}>Guardar Actual</button>
            </form>
          </div>

          <h2 style={{ ...styles.sectionTitle, marginTop: '24px' }}>Variables de Insumo</h2>
          
          {/* MATERIAL Y PESO */}
          <div style={styles.grid2}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Filamento <span style={styles.unit}>($/Kg)</span></label>
              <input type="number" name="precioFilamento" value={config.precioFilamento} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Peso Pieza <span style={styles.unit}>(g)</span></label>
              <input type="number" name="pesoPieza" value={config.pesoPieza} onChange={handleChange} style={styles.input} />
            </div>
          </div>

          {/* TIEMPO (HORAS Y MINUTOS) */}
          <label style={styles.label}>Tiempo de Impresión</label>
          <div style={{ ...styles.grid2, marginTop: '6px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="number" name="tiempoHoras" value={config.tiempoHoras} onChange={handleChange} style={{ ...styles.input, width: '100%' }} min="0" />
              <span style={styles.unit}>hs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="number" name="tiempoMinutos" value={config.tiempoMinutos} onChange={handleChange} style={{ ...styles.input, width: '100%' }} min="0" max="59" />
              <span style={styles.unit}>min</span>
            </div>
          </div>

          {/* SELECTOR DE MODO DE MÁQUINA */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Cálculo de Costo de Máquina</label>
            <select name="modoMaquina" value={config.modoMaquina} onChange={handleChange} style={styles.select}>
              <option value="tarifa">Usar Tarifa Fija por Hora (Recomendado)</option>
              <option value="avanzado">Calcular por Watts y KWh eléctrico</option>
            </select>
          </div>

          {/* ENTRADAS DINÁMICAS SEGÚN EL MODO DE MÁQUINA */}
          {config.modoMaquina === 'tarifa' ? (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tarifa Impresora Activa <span style={styles.unit}>($ por hora de uso)</span></label>
              <input type="number" name="tarjetaHoraMaquina" value={config.tarjetaHoraMaquina} onChange={handleChange} style={styles.input} />
            </div>
          ) : (
            <div style={styles.grid2}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Consumo <span style={styles.unit}>(Watts)</span></label>
                <input type="number" name="consumoMaquina" value={config.consumoMaquina} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Costo KWh <span style={styles.unit}>($)</span></label>
                <input type="number" name="costoKwh" value={config.costoKwh} onChange={handleChange} style={styles.input} />
              </div>
            </div>
          )}

          {/* EXTRAS: INSUMOS CON SWITCH TOTAL/UNIDAD */}
          <div style={styles.inputGroup}>
            <div style={styles.labelToggleContainer}>
              <label style={styles.label}>Insumos Extras</label>
              <label style={styles.toggleLabel}>
                <input 
                  type="checkbox" 
                  name="insumosPorTotal" 
                  checked={config.insumosPorTotal || false} 
                  onChange={() => handleCheckboxChange('insumosPorTotal')} 
                  style={styles.checkbox}
                />
                <span>¿Costo total set?</span>
              </label>
            </div>
            <input type="number" name="insumosAdicionales" value={config.insumosAdicionales} onChange={handleChange} style={styles.input} placeholder="Tornillos, imanes..." />
          </div>

          {/* EXTRAS: MANO DE OBRA CON SWITCH TOTAL/UNIDAD */}
          <div style={styles.inputGroup}>
            <div style={styles.labelToggleContainer}>
              <label style={styles.label}>Mano de Obra</label>
              <label style={styles.toggleLabel}>
                <input 
                  type="checkbox" 
                  name="manoObraPorTotal" 
                  checked={config.manoObraPorTotal || false} 
                  onChange={() => handleCheckboxChange('manoObraPorTotal')} 
                  style={styles.checkbox}
                />
                <span>¿Costo total set?</span>
              </label>
            </div>
            <input type="number" name="manoObra" value={config.manoObra} onChange={handleChange} style={styles.input} placeholder="Diseño, lijado..." />
          </div>

          {/* CANTIDAD SET Y MARGEN */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Cantidad de piezas en el Set</label>
            <input type="number" name="cantidadSet" value={config.cantidadSet} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={styles.label}>Margen de Ganancia</label>
              <span style={styles.badge}>{config.porcentajeGanancia}%</span>
            </div>
            <input type="range" name="porcentajeGanancia" min="0" max="200" value={config.porcentajeGanancia} onChange={handleChange} style={styles.range} />
          </div>
        </section>

        {/* COLUMNA DE RESULTADOS */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Desglose de Costos</h2>
          
          <div style={styles.resultBlock}>
            <h3 style={styles.resultBlockTitle}>Por Unidad</h3>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Material (Filamento)</span>
              <span style={styles.rowValue}>${costoMaterialPieza.toFixed(2)}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Uso de Máquina/Luz ({tiempoTotalEnHoras.toFixed(2)} hs)</span>
              <span style={styles.rowValue}>${costoMaquinaPieza.toFixed(2)}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Insumos Adicionales {config.insumosPorTotal && '(Prorrateado)'}</span>
              <span style={styles.rowValue}>${costoInsumosUnidad.toFixed(2)}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Mano de Obra {config.manoObraPorTotal && '(Prorrateado)'}</span>
              <span style={styles.rowValue}>${costoManoObraUnidad.toFixed(2)}</span>
            </div>
            
            <div style={styles.rowHighlight}>
              <span style={styles.rowLabelHighlight}>Costo Neto Fabricación</span>
              <span style={styles.rowValueHighlight}>${costoNetoPieza.toFixed(2)}</span>
            </div>
            <div style={styles.rowFinal}>
              <span style={styles.rowLabelFinal}>Precio de Venta</span>
              <span style={styles.rowValueFinal}>${precioVentaPieza.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ ...styles.resultBlock, marginTop: '24px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
            <h3 style={styles.resultBlockTitle}>Por Set ({cantidad} unidades)</h3>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Costo Neto Total Set</span>
              <span style={styles.rowValue}>${costoNetoSet.toFixed(2)}</span>
            </div>
            <div style={{ ...styles.rowFinal, background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}>
              <span style={{ color: '#bfdbfe', fontWeight: '600' }}>Venta Total Set</span>
              <span style={styles.rowValueFinal}>${precioVentaSet.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// 🎨 Estilos Oscuros Modificados (con nuevos estilos de perfiles)
const styles = {
  container: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    letterSpacing: '-0.04em',
    marginBottom: '8px',
    background: 'linear-gradient(to right, #3b82f6, #60a5fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    paddingBottom: "8px",
    lineHeight: "1.2",
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1rem',
    margin: 0,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '28px',
    border: '1px solid #334155',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginTop: 0,
    marginBottom: '24px',
    color: '#f1f5f9',
    borderBottom: '1px solid #334155',
    paddingBottom: '12px',
  },
  profileSection: {
    backgroundColor: '#0f172a55',
    padding: '16px',
    borderRadius: '12px',
    border: '1px dashed #475569',
  },
  profileList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
    marginBottom: '12px',
  },
  profileItem: {
    border: '1px solid',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.15s ease',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    padding: '0 2px',
  },
  button: {
    backgroundColor: '#3b82f6',
    border: 'none',
    color: '#ffffff',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.15s',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '18px',
  },
  labelToggleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2px',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: '#3b82f6',
    cursor: 'pointer',
    fontWeight: '600',
  },
  checkbox: {
    cursor: 'pointer',
    accentColor: '#3b82f6',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#cbd5e1',
  },
  unit: {
    color: '#64748b',
    fontSize: '0.75rem',
  },
  input: {
    backgroundColor: '#0f172a',
    border: '1px solid #475569',
    borderRadius: '10px',
    color: '#f8fafc',
    padding: '10px 14px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    backgroundColor: '#0f172a',
    border: '1px solid #475569',
    borderRadius: '10px',
    color: '#f8fafc',
    padding: '10px 14px',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
    width: "100%",
    boxSizing: "border-box",
  },
  badge: {
    backgroundColor: '#3b82f622',
    color: '#60a5fa',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  range: {
    width: '100%',
    accentColor: '#3b82f6',
    cursor: 'pointer',
    marginTop: '6px',
  },
  resultBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  resultBlockTitle: {
    fontSize: '1.05rem',
    color: '#94a3b8',
    margin: '0 0 4px 0',
    fontWeight: '500',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
    color: '#94a3b8',
    padding: '4px 0',
  },
  rowValue: {
    color: '#e2e8f0',
    fontWeight: '500',
  },
  rowHighlight: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
    padding: '12px 14px',
    backgroundColor: '#0f172a',
    borderRadius: '10px',
    marginTop: '4px',
  },
  rowLabelHighlight: {
    color: '#cbd5e1',
  },
  rowValueHighlight: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  rowFinal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.1rem',
    padding: '16px 20px',
    backgroundColor: '#3b82f618',
    border: '1px solid #3b82f633',
    borderRadius: '12px',
    marginTop: '8px',
  },
  rowLabelFinal: {
    color: '#60a5fa',
    fontWeight: '600',
  },
  rowValueFinal: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: '1.4rem',
  },
};