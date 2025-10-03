// src/components/PostEntry.js

// Definimos un componente llamado PostEntry.
// Recibe "props" (propiedades) como argumentos.
// Las props son como los ajustes que le das a un bloque de LEGO (color, tamaño, etc.).
function PostEntry({ imgSrc, title, date }) {
  return (
    <div className="d-flex post-entry">
      <div className="custom-thumbnail">
        {/* Usamos 'imgSrc' de las props para la ruta de la imagen */}
        {/* 'className' en lugar de 'class' */}
        <img src={imgSrc} alt="Imagen del post" className="img-fluid" />
      </div>
      <div className="post-content">
        {/* Usamos 'title' de las props para el título */}
        <h3>{title}</h3>
        <div className="post-meta"><span>Posted:</span> {date}</div>
      </div>
    </div>
  );
}

export default PostEntry; // Exportamos el componente para poder usarlo en otros archivos