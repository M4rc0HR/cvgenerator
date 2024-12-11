"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

export default function Home() {

  // Información personal
  const [personalInfo, setPersonalInfo] = useState({
    nombres: "",
    apellidos: "",
    cargo: "",
    email: "",
    telefono: "",
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


  //Habilidades
  const [habilidades, setHabilidades] = useState([""]);

  const handleHabilidadChange = (index, value) => {
    const updatedHabilidades = [...habilidades];
    updatedHabilidades[index] = value;
    setHabilidades(updatedHabilidades);
  };
  const addHabilidad = () => setHabilidades([...habilidades, ""]);
  const removeHabilidad = (index) => setHabilidades(habilidades.filter((_, i) => i !== index));

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
  }, [personalInfo, habilidades, experiencia, educacion]);








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
    const horizontalStripeColor = [20, 63, 114]; // Color azul oscuro (RGB)
  
    doc.setFillColor(...horizontalStripeColor);
    doc.rect(0, 0, horizontalStripeWidth, horizontalStripeHeight, "F");
  
    // Configuración de la franja vertical (columna izquierda)
    const verticalStripeWidth = 75;
    const verticalStripeHeight = pageHeight;
    const verticalStripeColor = [56, 109, 173]; // Color azul claro (RGB)
  
    doc.setFillColor(...verticalStripeColor);
    doc.rect(10, 0, verticalStripeWidth, verticalStripeHeight, "F");
  
    // Nombre y Apellidos (centrado)

    doc.setFont(undefined, 'bold');
    doc.setFontSize(32);
    doc.setTextColor(255, 255, 255);
    doc.text(personalInfo.nombres.toLocaleUpperCase(), (pageWidth / 2) + 42, 23, { align: "center" });
    doc.text(personalInfo.apellidos.toLocaleUpperCase(), (pageWidth / 2) + 42, 38, { align: "center" });
  
    // Cargo actual (debajo del nombre)
    doc.setFontSize(20);
    doc.setFont(undefined, 'normal')
    doc.text(`${personalInfo.cargo.toLocaleUpperCase()}`, (pageWidth / 2) + 42, 50, { align: "center" });
  
    // Imagen de perfil (si existe)
    if (personalInfo.imagen) {
      doc.addImage(personalInfo.imagen, "JPEG", 20, 20, 55, 55);
    }

  
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
  
    const addTextWithSpacing = (text, yPos, margin) => {
      doc.text(text, margin, yPos);
      return yPos + 8 ; // Espaciado consistente
    };
  

    // Información de contacto (Columna Izquierda)

    doc.setFontSize(24);
    doc.setFont(undefined, 'bold')
    doc.text("Contacto", marginLeft, yPositionLeft);
    yPositionLeft += 10;


    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    yPositionLeft = addTextWithSpacing(`${personalInfo.telefono}`, yPositionLeft, marginLeft);
    yPositionLeft -= 2;
    yPositionLeft = addTextWithSpacing(`${personalInfo.email}`, yPositionLeft, marginLeft);
    yPositionLeft -= 2;
    yPositionLeft = addTextWithSpacing(`${personalInfo.paginaWeb}`, yPositionLeft, marginLeft);
    yPositionLeft -= 2;


    
     // Linea divisora
     
     doc.setDrawColor(255, 255, 255);
     doc.setLineWidth(0.5);

     doc.line(marginLeft - 5, yPositionLeft, pageWidth - 130, yPositionLeft);
     yPositionLeft += 12;

    // Habilidades (Columna Izquierda)

    doc.setFontSize(24);
    doc.setFont(undefined, 'bold')
    doc.text("Habilidades", marginLeft, yPositionLeft);
    yPositionLeft += 10;

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');

    habilidades.forEach((habilidad) => {
      yPositionLeft = addTextWithSpacing(`• ${habilidad}`, yPositionLeft - 2, marginLeft);
    });
  
    yPositionLeft -= 2;
    // Educación (Columna Izquierda)
    
    
       
     // Linea divisora
     
     doc.setDrawColor(255, 255, 255);
     doc.setLineWidth(0.5);

     doc.line(marginLeft - 5, yPositionLeft, pageWidth - 130, yPositionLeft);
     yPositionLeft += 12;


    doc.setFontSize(24);
    doc.setFont(undefined, 'bold')
    doc.text("Educación", marginLeft, yPositionLeft);
    yPositionLeft += 10;

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    educacion.forEach((edu) => {
      doc.setFont(undefined, 'bold');

      const puestoLines = doc.splitTextToSize(`• ${edu.carrera}`, pageWidth / 2 - 55);
      doc.text(puestoLines, marginLeft-2 , yPositionLeft, { maxWidth: pageWidth / 2 - 55, align: 'justify' });
      yPositionLeft += (puestoLines.length * 5) + 1;
    
      doc.setFont(undefined, 'normal');
      const organizacionLines = doc.splitTextToSize(`${edu.institucion}`, pageWidth / 2 - 55);
      doc.text(organizacionLines, marginLeft - 2, yPositionLeft - 1, { maxWidth: pageWidth / 2 - 55, align: 'justify' });
      yPositionLeft += (organizacionLines.length * 5) + 1;

      const fechasLine = `${edu.fechaInicio} - ${edu.fechaFin}`;
      const fechasLines = doc.splitTextToSize(fechasLine, pageWidth / 2 - 55);
      doc.text(fechasLines, marginLeft - 2, yPositionLeft - 3, { maxWidth: pageWidth / 2 - 55, align: 'justify' });
      yPositionLeft += 5;
    
      const descripcionLines = doc.splitTextToSize(edu.descripcion, pageWidth / 2 - 55);
      doc.text(descripcionLines, marginLeft - 2, yPositionLeft - 3, { maxWidth: pageWidth / 2 - 55, align: 'justify' });
    });
    



    // Acerca de mí (Columna Derecha)

    doc.setTextColor(20, 63, 114);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold')
    doc.text("Acerca de mí", marginRight, yPositionRight);
    yPositionRight += 10;

    doc.setFontSize(11);

    doc.setFont(undefined, 'normal')
    const acercaDeMiLines = doc.splitTextToSize(personalInfo.acercaDeMi, pageWidth / 2 - 2);
    doc.text(acercaDeMiLines, marginRight, yPositionRight, { maxWidth: pageWidth / 2 - 2 , align: "justify" });
    yPositionRight += (acercaDeMiLines.length * 5) + 1;


     // Linea divisora
     
    doc.setDrawColor(20, 63, 114);
    doc.setLineWidth(0.5);
    doc.line(marginRight, yPositionRight, pageWidth - 10, yPositionRight);
    yPositionRight += 12;

    // Experiencia Laboral (Columna Derecha)

    doc.setTextColor(20, 63, 114);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold')
    doc.text("Experiencia Laboral", marginRight, yPositionRight);
    yPositionRight += 10;


    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    experiencia.forEach((exp) => {
      doc.setFont(undefined, 'bold');

      const puestoLines = doc.splitTextToSize(`• ${exp.puesto}`, pageWidth / 2 - 4);
      doc.text(puestoLines, marginRight + 2, yPositionRight, { maxWidth: pageWidth / 2 - 4, align: 'justify' });
      yPositionRight += puestoLines.length * 5 - 1;
    
      doc.setFont(undefined, 'normal');
      const organizacionLines = doc.splitTextToSize(`${exp.organizacion}`, pageWidth / 2 - 4);
      doc.text(organizacionLines, marginRight + 2, yPositionRight, { maxWidth: pageWidth / 2 - 4, align: 'justify' });
      yPositionRight += organizacionLines.length * 5 - 1;
    
      const fechasLine = `(${exp.fechaInicio} - ${exp.fechaFin})`;
      const fechasLines = doc.splitTextToSize(fechasLine, pageWidth / 2 - 4);
      doc.text(fechasLines, marginRight + 2, yPositionRight, { maxWidth: pageWidth / 2 - 4, align: 'justify' });
      yPositionRight += fechasLines.length * 5 - 1;
    
      const descripcionLines = doc.splitTextToSize(exp.descripcion, pageWidth / 2 - 4);
      doc.text(descripcionLines, marginRight + 3, yPositionRight, { maxWidth: pageWidth / 2 - 4, align: 'justify' });
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

                  {/* Campo Página Web */}
                  <div className="col-span-1">
                    <label className="block text-gray-600 mb-2">Página Web</label>
                    <input
                      type="text"
                      name="paginaWeb"
                      value={personalInfo.paginaWeb}
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
                    <input
                      type="text"
                      value={habilidad}
                      onChange={(e) => handleHabilidadChange(index, e.target.value)}
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
                <button type="button" onClick={addHabilidad} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                  Añadir Habilidad
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
