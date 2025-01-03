"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { estrellaRellenaBase64, estrellaVaciaBase64, location, phone, mail, date } from './imagenesBase64';
import '../app/fonts/Roboto-Regular-normal';
import '../app/fonts/Roboto-Bold.js';


function changeImageColor(base64Image, color) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.src = base64Image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Dibuja la imagen
      ctx.drawImage(img, 0, 0);

      // Cambia el modo de composición
      ctx.globalCompositeOperation = "source-in";

      // Aplica el nuevo color
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Retorna la nueva imagen en Base64
      resolve(canvas.toDataURL());
    };
  });
}

export default function Home() {

  // Información personal
  const [personalInfo, setPersonalInfo] = useState({
    nombres: "",
    apellidos: "",
    cargo: "",
    email: "",
    telefono: "",
    fechNacimiento: "",
    direccion: "",
    paginaWeb: "",
    acercaDeMi: "",
    imagen: null,
  });

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalInfo((prev) => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };


  // Habilidades
  const [habilidades, setHabilidades] = useState([{ nombre: "" }]);

  const handleHabilidadChange = (index, updatedHabilidad) => {
    const updatedHabilidades = [...habilidades];
    updatedHabilidades[index] = updatedHabilidad;
    setHabilidades(updatedHabilidades);
  };

  const addHabilidad = () => {
    setHabilidades([...habilidades, { nombre: "" }]);
  };

  const removeHabilidad = (index) => {
    setHabilidades(habilidades.filter((_, i) => i !== index));
  };



  //Cursos
  const [cursos, setCursos] = useState([
    { nombre: "", organizacion: "", nivel: 1 }
  ]);

  const handleCursoChange = (index, updatedCurso) => {
    const updatedCursos = [...cursos];
    updatedCursos[index] = updatedCurso;
    setCursos(updatedCursos);
  };

  const addCurso = () => {
    setCursos([...cursos, { nombre: "", organizacion: "", nivel: 1 }]);
  };

  const removeCurso = (index) => {
    setCursos(cursos.filter((_, i) => i !== index));
  };






  // Experiencia
  const [experiencia, setExperiencia] = useState([
    {
      puesto: "",
      organizacion: "",
      fechaInicio: "",
      fechaFin: "",
      hastaActualidad: false,
      descripcion: "",
    },
  ]);

  const handleExperienciaChange = (index, field, value) => {
    const updatedExperiencia = [...experiencia];
    updatedExperiencia[index][field] = value;
    setExperiencia(updatedExperiencia);
  };

  const toggleHastaActualidad = (index) => {
    const updatedExperiencia = [...experiencia];
    updatedExperiencia[index].hastaActualidad = !updatedExperiencia[index].hastaActualidad;
    updatedExperiencia[index].fechaFin = updatedExperiencia[index].hastaActualidad
      ? "Hasta la actualidad"
      : "";
    setExperiencia(updatedExperiencia);
  };

  const addExperiencia = () =>
    setExperiencia([
      ...experiencia,
      { puesto: "", organizacion: "", fechaInicio: "", fechaFin: "", hastaActualidad: false, descripcion: "" },
    ]);

  const removeExperiencia = (index) =>
    setExperiencia(experiencia.filter((_, i) => i !== index));

  // Educación
  const [educacion, setEducacion] = useState([
    {
      institucion: "",
      carrera: "",
      fechaInicio: "",
      fechaFin: "",
      hastaActualidad: false,
      descripcion: "",
    },
  ]);

  const handleEducacionChange = (index, field, value) => {
    const updatedEducacion = [...educacion];
    updatedEducacion[index][field] = value;
    setEducacion(updatedEducacion);
  };

  const toggleHastaActualidadEducacion = (index) => {
    const updatedEducacion = [...educacion];
    updatedEducacion[index].hastaActualidad = !updatedEducacion[index].hastaActualidad;
    updatedEducacion[index].fechaFin = updatedEducacion[index].hastaActualidad
      ? "Hasta la actualidad"
      : "";
    setEducacion(updatedEducacion);
  };

  const addEducacion = () =>
    setEducacion([
      ...educacion,
      { institucion: "", carrera: "", fechaInicio: "", fechaFin: "", hastaActualidad: false, descripcion: "" },
    ]);

  const removeEducacion = (index) =>
    setEducacion(educacion.filter((_, i) => i !== index));



  // Actualizar PDF dinámicamente cuando cambia la información
  useEffect(() => {
    generarPDFDinamico();
  }, [personalInfo, habilidades, cursos, experiencia, educacion]);



  const generarPDFDinamico = () => {





    const doc = new jsPDF();


    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginLeft = 20;
    const marginRight = pageWidth / 2 - 10;

    let yPositionLeft = 90;
    let yPositionRight = 75;

    // Configuración de la franja horizontal (detrás del nombre)
    const horizontalStripeWidth = pageWidth;
    const horizontalStripeHeight = 60;
    const horizontalStripeColor = [111, 111, 111]; // Color azul oscuro (RGB)

    doc.setFillColor(...horizontalStripeColor);
    doc.rect(0, 0, horizontalStripeWidth, horizontalStripeHeight, "F");

    // Configuración de la franja vertical (columna izquierda)
    const verticalStripeWidth = 75;
    const verticalStripeHeight = pageHeight;
    const verticalStripeColor = [227, 227, 227];

    doc.setFillColor(...verticalStripeColor);
    doc.rect(10, 0, verticalStripeWidth, verticalStripeHeight, "F");




    // Nombre y Apellidos (centrado)

    doc.setFont('Roboto-Bold', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(255, 255, 255);
    doc.text(personalInfo.nombres.toLocaleUpperCase(), (pageWidth / 2) + 42, 23, { align: "center" });
    doc.text(personalInfo.apellidos.toLocaleUpperCase(), (pageWidth / 2) + 42, 38, { align: "center" });

    // Cargo actual (debajo del nombre)
    doc.setFontSize(20);
    doc.setFont('Roboto-Regular', 'normal');
    doc.text(`${personalInfo.cargo.toLocaleUpperCase()}`, (pageWidth / 2) + 42, 50, { align: "center" });

    // Imagen de perfil (si existe)
    if (personalInfo.imagen) {
      doc.addImage(personalInfo.imagen, "JPEG", 20, 20, 55, 55);
    }



    doc.setFontSize(14);
    doc.setTextColor(82, 82, 82);

    const addTextWithSpacing = (text, yPos, margin) => {
      doc.text(text, margin, yPos);
      return yPos + 8; // Espaciado consistente
    };


    // Información de contacto (Columna Izquierda)

    doc.setFontSize(24);
    doc.setFont('Roboto-Bold', 'bold');
    doc.text("Contacto", marginLeft, yPositionLeft);
    yPositionLeft += 6;





    doc.setFontSize(11);
    doc.setFont('Roboto-Regular', 'normal');

    const iconSize = 4; // Tamaño del ícono (ancho y alto)
    const iconMarginRight = 2; // Espacio entre el ícono y el texto
    const textXPosition = marginLeft + iconSize + iconMarginRight; // Posición X para el texto

    // Teléfono
    doc.addImage(phone, "PNG", marginLeft, yPositionLeft - iconSize + 1 / 2, iconSize, iconSize);
    yPositionLeft = addTextWithSpacing(`${personalInfo.telefono}`, yPositionLeft, textXPosition);
    yPositionLeft -= 2;

    // Email
    doc.addImage(mail, "PNG", marginLeft, yPositionLeft - iconSize + 1 / 2, iconSize, iconSize);
    yPositionLeft = addTextWithSpacing(`${personalInfo.email}`, yPositionLeft, textXPosition);
    yPositionLeft -= 2;

    // Dirección
    doc.addImage(location, "PNG", marginLeft, yPositionLeft - iconSize + 1 / 2, iconSize, iconSize);
    yPositionLeft = addTextWithSpacing(`${personalInfo.direccion}`, yPositionLeft, textXPosition);
    yPositionLeft -= 2;

    // Fecha de nacimiento
    doc.addImage(date, "PNG", marginLeft, yPositionLeft - iconSize + 1 / 2, iconSize, iconSize);
    yPositionLeft = addTextWithSpacing(`${personalInfo.fechNacimiento}`, yPositionLeft, textXPosition);
    yPositionLeft -= 2;



    // Linea divisora

    doc.setDrawColor(82, 82, 82);
    doc.setLineWidth(0.5);

    doc.line(marginLeft - 5, yPositionLeft, pageWidth - 130, yPositionLeft);
    yPositionLeft += 12;



    // Habilidades (Columna Izquierda)
    doc.setFontSize(24);
    doc.setFont('Roboto-Bold', 'bold');
    doc.text("Habilidades", marginLeft, yPositionLeft);
    yPositionLeft += 8;

    doc.setFontSize(11);
    doc.setFont('Roboto-Regular', 'normal');

    habilidades.forEach((habilidad) => {
      // Agrega el texto de la habilidad
      const habilidadTexto = `• ${habilidad.nombre}`;
      yPositionLeft = addTextWithSpacing(habilidadTexto, yPositionLeft - 1, marginLeft);
    });



    yPositionLeft -= 2;
    // Linea divisora

    doc.setDrawColor(82, 82, 82);
    doc.setLineWidth(0.5);

    doc.line(marginLeft - 5, yPositionLeft, pageWidth - 130, yPositionLeft);
    yPositionLeft += 12;

    // Educación (Columna Izquierda)
    doc.setFontSize(24);
    doc.setFont('Roboto-Bold', 'bold');
    doc.text("Educación", marginLeft, yPositionLeft);
    yPositionLeft += 8;

    doc.setFontSize(11);
    doc.setFont('Roboto-Regular', 'normal');
    educacion.forEach((edu) => {
      doc.setFont('Roboto-Bold', 'bold');

      const puestoLines = doc.splitTextToSize(`• ${edu.carrera}`, pageWidth / 2 - 55);
      doc.text(puestoLines, marginLeft, yPositionLeft, { maxWidth: pageWidth / 2 - 55, align: 'justify' });
      yPositionLeft += (puestoLines.length * 5) + 1;

      doc.setFont('Roboto-Regular', 'normal');
      const organizacionLines = doc.splitTextToSize(`${edu.institucion}`, pageWidth / 2 - 55);
      doc.text(organizacionLines, marginLeft + 2, yPositionLeft - 1, { maxWidth: pageWidth / 2 - 55, align: 'justify' });
      yPositionLeft += (organizacionLines.length * 5) + 1;

      const fechasLine = `(${edu.fechaInicio} - ${edu.fechaFin})`;
      const fechasLines = doc.splitTextToSize(fechasLine, pageWidth / 2 - 55);
      doc.text(fechasLines, marginLeft + 2, yPositionLeft - 3, { maxWidth: pageWidth / 2 - 55, align: 'justify' });
      yPositionLeft += 5;

      const descripcionLines = doc.splitTextToSize(edu.descripcion, pageWidth / 2 - 55);
      doc.text(descripcionLines, marginLeft + 2, yPositionLeft - 3, { maxWidth: pageWidth / 2 - 55, align: 'justify' });
    });



    // Linea divisora

    doc.setDrawColor(82, 82, 82);
    doc.setLineWidth(0.5);

    doc.line(marginLeft - 5, yPositionLeft, pageWidth - 130, yPositionLeft);
    yPositionLeft += 12;



    // Cursos (Columna Izquierda)
    doc.setFontSize(24);
    doc.setFont('Roboto-Bold', 'bold');
    doc.text("Cursos", marginLeft, yPositionLeft);
    yPositionLeft += 8;

    doc.setFontSize(11);
    doc.setFont('Roboto-Regular', 'normal');

    cursos.forEach((curso) => {
      // Agrega el texto de la habilidad
      doc.setFont('Roboto-Bold', 'bold');
      const cursoTexto = `• ${curso.nombre}`;
      yPositionLeft = addTextWithSpacing(cursoTexto, yPositionLeft - 2, marginLeft);

      doc.setFont('Roboto-Regular', 'normal');
      const organizacionLines = doc.splitTextToSize(`${curso.organizacion}`, pageWidth / 2 - 55);
      doc.text(organizacionLines, marginLeft + 2, yPositionLeft - 3, { maxWidth: pageWidth / 2 - 55, align: 'justify' });
      yPositionLeft += (organizacionLines.length * 5) + 1;


      // Calcula la posición horizontal de las estrellas según el ancho del texto de la habilidad
      const textWidth = doc.getTextWidth(cursoTexto);
      const xPosition = marginLeft + 5; // Posición a la derecha del texto (ajustable)


      // Agrega las estrellas debajo del texto de la habilidad
      for (let i = 1; i <= 5; i++) {
        const estrellaRuta = i <= curso.nivel ? estrellaRellenaBase64 : estrellaVaciaBase64;
        doc.addImage(estrellaRuta, "PNG", xPosition + (i - 1) * 8, yPositionLeft - 6, 4, 4); // Ajusta la posición de cada estrella
      }

      // Espaciado adicional para la siguiente habilidad
      yPositionLeft += 4; // Espaciado entre habilidades (incluyendo espacio para las estrellas)
    });



    // Acerca de mí (Columna Derecha)

    doc.setTextColor(82, 82, 82);
    doc.setFontSize(24);
    doc.setFont('Roboto-Bold', 'bold');
    doc.text("Acerca de mí", marginRight, yPositionRight);
    yPositionRight += 8;

    doc.setFontSize(11);

    doc.setFont('Roboto-Regular', 'normal');
    const acercaDeMiLines = doc.splitTextToSize(personalInfo.acercaDeMi, pageWidth / 2 - 2);
    doc.text(acercaDeMiLines, marginRight, yPositionRight, { maxWidth: pageWidth / 2 - 2, align: "justify" });
    yPositionRight += (acercaDeMiLines.length * 5) + 1;


    // Linea divisora

    doc.setDrawColor(82, 82, 82);
    doc.setLineWidth(0.5);
    doc.line(marginRight, yPositionRight, pageWidth - 10, yPositionRight);
    yPositionRight += 12;

    // Experiencia Laboral (Columna Derecha)

    doc.setTextColor(82, 82, 82);
    doc.setFontSize(24);
    doc.setFont('Roboto-Bold', 'bold');
    doc.text("Experiencia Laboral", marginRight, yPositionRight);
    yPositionRight += 8;


    doc.setFontSize(11);
    doc.setFont('Roboto-Regular', 'normal');
    experiencia.forEach((exp) => {
      doc.setFont('Roboto-Bold', 'bold');

      const puestoLines = doc.splitTextToSize(`• ${exp.puesto}`, pageWidth / 2 - 4);
      doc.text(puestoLines, marginRight, yPositionRight, { maxWidth: pageWidth / 2 - 4, align: 'justify' });
      yPositionRight += puestoLines.length * 5 - 1;

      doc.setFont('Roboto-Regular', 'normal');
      const organizacionLines = doc.splitTextToSize(`${exp.organizacion}`, pageWidth / 2 - 4);
      doc.text(organizacionLines, marginRight + 2, yPositionRight, { maxWidth: pageWidth / 2 - 4, align: 'justify' });
      yPositionRight += organizacionLines.length * 5 - 1;

      const fechasLine = `(${exp.fechaInicio} - ${exp.fechaFin})`;
      const fechasLines = doc.splitTextToSize(fechasLine, pageWidth / 2 - 4);
      doc.text(fechasLines, marginRight + 2, yPositionRight, { maxWidth: pageWidth / 2 - 4, align: 'justify' });
      yPositionRight += fechasLines.length * 5 - 1;

      const descripcionLines = doc.splitTextToSize(exp.descripcion, pageWidth / 2 - 4);
      doc.text(descripcionLines, marginRight + 2, yPositionRight, { maxWidth: pageWidth / 2 - 4, align: 'justify' });
      yPositionRight += descripcionLines.length * 5 - 1;

    });



    // Generar vista previa del PDF
    const pdfBlob = doc.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);

    document.getElementById("pdfPreview").src = pdfURL;
  };






  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Generador de Currículum Vitae</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div>
            <form>


              {/* Información Personal */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Información Personal</h2>

                {/* Grid principal para distribuir los campos en dos columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campo Nombres */}
                  <div className="col-span-1">
                    <label className="block text-gray-600 mb-2">Nombres</label>
                    <input
                      type="text"
                      name="nombres"
                      value={personalInfo.nombres}
                      onChange={handlePersonalInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Campo Apellidos */}
                  <div className="col-span-1">
                    <label className="block text-gray-600 mb-2">Apellidos</label>
                    <input
                      type="text"
                      name="apellidos"
                      value={personalInfo.apellidos}
                      onChange={handlePersonalInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Campo Cargo */}
                  <div className="col-span-1">
                    <label className="block text-gray-600 mb-2">Cargo</label>
                    <input
                      type="text"
                      name="cargo"
                      value={personalInfo.cargo}
                      onChange={handlePersonalInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Campo Fecha de Nacimiento */}
                  <div className="col-span-1">
                    <label className="block text-gray-600 mb-2">Fecha de Nacimiento</label>
                    <input
                      type="text"
                      name="fechNacimiento"
                      value={personalInfo.fechNacimiento}
                      onChange={handlePersonalInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Campo direccion */}
                  <div className="col-span-1">
                    <label className="block text-gray-600 mb-2">Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={personalInfo.direccion}
                      onChange={handlePersonalInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Campo Teléfono */}
                  <div className="col-span-1">
                    <label className="block text-gray-600 mb-2">Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      value={personalInfo.telefono}
                      onChange={handlePersonalInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Campo Email */}
                  <div className="col-span-1">
                    <label className="block text-gray-600 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Campo Acerca de mí */}
                  <div className="col-span-2">
                    <label className="block text-gray-600 mb-2">Acerca de mí</label>
                    <textarea
                      name="acercaDeMi"
                      value={personalInfo.acercaDeMi}
                      onChange={handlePersonalInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    />
                  </div>

                  {/* Contenedor para subir la imagen */}
                  <div className="col-span-2 md:col-span-1 flex flex-col">
                    <label className="block text-gray-600 mb-2">Foto de Perfil</label>
                    <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg w-full h-[200px] hover:bg-gray-50 transition duration-200">
                      {/* Campo para subir la imagen */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />

                      {/* Vista previa de la imagen */}
                      {personalInfo.imagen ? (
                        <div
                          className="w-full h-full cursor-pointer"
                          onClick={() => document.querySelector('input[type="file"]').click()}
                        >
                          <img
                            src={personalInfo.imagen}
                            alt="Vista previa"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center cursor-pointer"
                          onClick={() => document.querySelector('input[type="file"]').click()}
                        >
                          <span className="text-gray-500 text-center">Haz clic para subir una imagen</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Habilidades */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Habilidades</h2>
                {habilidades.map((habilidad, index) => (
                  <div key={index} className="flex items-center gap-4 mb-2">
                    {/* Campo para el nombre de la habilidad */}
                    <input
                      type="text"
                      value={habilidad.nombre}
                      onChange={(e) =>
                        handleHabilidadChange(index, { ...habilidad, nombre: e.target.value })
                      }
                      placeholder="Nombre de la habilidad"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeHabilidad(index)}
                      className="text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addHabilidad}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                >
                  Añadir Habilidad
                </button>
              </section>





              {/* Cursos */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Cursos</h2>
                {cursos.map((curso, index) => (
                  <div key={index} className="flex items-center gap-4 mb-2">
                    {/* Campo para el nombre del curso */}
                    <input
                      type="text"
                      value={curso.nombre}
                      onChange={(e) =>
                        handleCursoChange(index, { ...curso, nombre: e.target.value })
                      }
                      placeholder="Nombre del curso"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* Campo para la organización */}
                    <input
                      type="text"
                      value={curso.organizacion}
                      onChange={(e) =>
                        handleCursoChange(index, { ...curso, organizacion: e.target.value })
                      }
                      placeholder="Organización"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Selección de nivel de curso */}
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={curso.nivel}
                      onChange={(e) =>
                        handleCursoChange(index, { ...curso, nivel: parseInt(e.target.value) })
                      }
                      placeholder="Nivel (1-5)"
                      className="w-20 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeCurso(index)}
                      className="text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCurso}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                >
                  Añadir Curso
                </button>
              </section>



              {/* Educacion */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Educacion</h2>
                {educacion.map((edu, index) => (
                  <div key={index} className="mb-4 border-b border-gray-300 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-600 mb-2">Carrera</label>
                        <input
                          type="text"
                          value={edu.carrera}
                          onChange={(e) => handleEducacionChange(index, "carrera", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-2">institucion</label>
                        <input
                          type="text"
                          value={edu.institucion}
                          onChange={(e) => handleEducacionChange(index, "institucion", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-2">Año de Inicio</label>
                        <input
                          type="text"
                          value={edu.fechaInicio}
                          onChange={(e) => handleEducacionChange(index, "fechaInicio", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-2">Año de Fin</label>
                        <input
                          type="text"
                          value={edu.hastaActualidad ? "" : edu.fechaFin}
                          disabled={edu.hastaActualidad}
                          onChange={(e) => handleEducacionChange(index, "fechaFin", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="mt-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={edu.hastaActualidad}
                              onChange={() => toggleHastaActualidadEducacion(index)}
                              className="mr-2"
                            />
                            Hasta la actualidad
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-600 mb-2">Descripción</label>
                        <textarea
                          value={edu.descripcion}
                          onChange={(e) => handleEducacionChange(index, "descripcion", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeEducacion(index)} className="text-red-500 mt-2">
                      Eliminar Educacion
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addEducacion} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                  Añadir Educacion
                </button>
              </section>


              {/* Experiencia Laboral */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Experiencia Laboral</h2>
                {experiencia.map((exp, index) => (
                  <div key={index} className="mb-4 border-b border-gray-300 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-600 mb-2">Puesto</label>
                        <input
                          type="text"
                          value={exp.puesto}
                          onChange={(e) => handleExperienciaChange(index, "puesto", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-2">Organización</label>
                        <input
                          type="text"
                          value={exp.organizacion}
                          onChange={(e) => handleExperienciaChange(index, "organizacion", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-2">Año de Inicio</label>
                        <input
                          type="text"
                          value={exp.fechaInicio}
                          onChange={(e) => handleExperienciaChange(index, "fechaInicio", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-2">Año de Fin</label>
                        <input
                          type="text"
                          value={exp.hastaActualidad ? "" : exp.fechaFin}
                          disabled={exp.hastaActualidad}
                          onChange={(e) => handleExperienciaChange(index, "fechaFin", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="mt-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={exp.hastaActualidad}
                              onChange={() => toggleHastaActualidad(index)}
                              className="mr-2"
                            />
                            Hasta la actualidad
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-600 mb-2">Descripción</label>
                        <textarea
                          value={exp.descripcion}
                          onChange={(e) => handleExperienciaChange(index, "descripcion", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeExperiencia(index)} className="text-red-500 mt-2">
                      Eliminar Experiencia
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addExperiencia} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                  Añadir Experiencia
                </button>
              </section>

            </form>
          </div>

          {/* Vista previa del PDF */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg h-max sticky top-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Vista Previa PDF</h2>
            <iframe id="pdfPreview" className="w-full h-[850px]" />
          </div>


        </div>
      </div>
    </div>
  );



}
