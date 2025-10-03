// frontend/src/pages/sidebar.js
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importamos Link y useLocation para navegación

function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sidebarRef = useRef(null); // Creamos una referencia para el elemento de la barra lateral
  const location = useLocation(); // Hook para obtener la ruta actual

  const toggleMenu = (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del enlace
    setIsMenuOpen(!isMenuOpen);
  };

  // Efecto para manejar la clase 'show-sidebar' en el <body> (si aún la usas para el overlay)
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('show-sidebar');
    } else {
      document.body.classList.remove('show-sidebar');
    }

    return () => {
      document.body.classList.remove('show-sidebar');
    };
  }, [isMenuOpen]);

  // Efecto para manejar el clic fuera de la barra lateral
  useEffect(() => {
    function handleClickOutside(event) {
      // Si la barra lateral existe, el menú está abierto, y el clic no fue dentro de la barra lateral
      // y el clic tampoco fue en el botón de toggle (para que el botón maneje su propio estado)
      if (sidebarRef.current && isMenuOpen && !sidebarRef.current.contains(event.target) && !event.target.closest('.js-menu-toggle')) {
        setIsMenuOpen(false); // Cierra el menú
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    // Asignamos la referencia 'sidebarRef' al elemento 'aside'
    // La clase 'active' controla la visibilidad del sidebar según tu CSS existente
    <aside className={`sidebar ${isMenuOpen ? 'active' : ''}`} ref={sidebarRef}>
      {/* Botón de Hamburguesa (Burger) - MANTENIDO */}
      <div className="toggle">
        <a href="#" className={`burger js-menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
        </a>
      </div>

      <div className="side-inner">
        {/* Sección del Logo y Nombre de la Empresa */}
        <div className="profile d-flex flex-column align-items-center mb-4 p-3">
          {/* NUEVO CONTENEDOR PARA EL LOGO CON REDONDEADO FORZADO */}
          <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 20px auto' }}>
            <img
              src="/images/logoSoulAldana.jpeg"
              alt="Logo Empresa de Modelaje"
              // Quitamos className="img-fluid mb-2" y cualquier style inline aquí
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} // La imagen debe llenar este nuevo contenedor
            />
          </div>
          <h3 className="name text-white mb-0">Magnus Models</h3>
          <span className="country text-muted small">Plataforma de Gestión Integral</span>
        </div>

        {/* Eliminada la sección "counter" ya que no es relevante */}

        {/* Menú de Navegación */}
        <div className="nav-menu">
          <ul>
            {/* Elementos de Navegación con Links de React Router */}
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/">
                <span className="icon-home mr-3"></span>Gestion de Usuarios
              </Link>
            </li>
            <li className={location.pathname === '/modelos' ? 'active' : ''}>
              <Link to="/modelos">
                <span className="icon-user-friends mr-3"></span>Gestión de Modelos
              </Link>
            </li>
            <li className={location.pathname === '/clientes' ? 'active' : ''}>
              <Link to="/clientes">
                <span className="icon-building mr-3"></span>Clientes
              </Link>
            </li>
            {/* <li className={location.pathname === '/castings' ? 'active' : ''}>
              <Link to="/castings">
                <span className="icon-bullhorn mr-3"></span>....
              </Link>
            </li>
            <li className={location.pathname === '/agenda' ? 'active' : ''}>
              <Link to="/agenda">
                <span className="icon-calendar-alt mr-3"></span>....
              </Link>
            </li> */}
            <li className={location.pathname === '/reportes' ? 'active' : ''}>
              <Link to="/reportes">
                <span className="icon-chart-line mr-3"></span>Reportes y Estadísticas
              </Link>
            </li>
            {/* Un separador si lo deseas, aunque sin CSS no tendrá el estilo de línea */}
            {/* <li className="sidebar-divider my-3"></li> */}
            <li className={location.pathname === '/ajustes' ? 'active' : ''}>
              <Link to="/ajustes">
                <span className="icon-cog mr-3"></span>Ajustes del Sistema
              </Link>
            </li>
            <li> {/* No necesariamente tiene una ruta activa, es una acción */}
              <Link to="/cerrar-sesion">
                <span className="icon-sign-out mr-3"></span>Cerrar Sesión
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;