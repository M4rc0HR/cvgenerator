"use client"; // Marca el archivo como un Client Component

import React, { useEffect, useState } from "react";

export default function Home() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    fetch("/datos.json")
      .then((response) => response.json())
      .then((data) => setDatos(data.features))
      .catch((error) => console.error("Error al cargar datos:", error));
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen p-8">
      <div className="max-w-screen-xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-white mb-8">
          <span className="text-yellow-300">Puntos de Muestreo</span> para el Cuidado del Medio Ambiente
        </h1>
        <p className="text-white text-xl mb-6">
          Soluciones tecnológicas para la sostenibilidad de los recursos naturales en la región Cajamarca.
        </p>
        <p className="text-white text-lg mb-12">
          Exploramos el uso de IA y IoT para impulsar el cuidado del agua y el medio ambiente en las comunidades locales.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {datos.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
            >
              <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-4 rounded-lg text-white">
                <strong className="text-2xl">{feature.properties.DESCRIPCION}</strong>
              </div>

              <div className="mt-4 text-gray-700 space-y-2">
                <p>
                  <b>Departamento:</b> {feature.properties.DEPARTAMENTO}
                </p>
                <p>
                  <b>Provincia:</b> {feature.properties.PROVINCIA}
                </p>
                <p>
                  <b>Latitud:</b> {feature.properties.LATITUD}
                </p>
                <p>
                  <b>Longitud:</b> {feature.properties.LONGITUD}
                </p>
                <p>
                  <b>Tipo de Cuerpo de Agua:</b> {feature.properties.TIPOCUERPOAGUA}
                </p>
                <p>
                  <b>Categoría:</b> {feature.properties.CATEGORIA}
                </p>
                <p>
                  <b>Estado:</b>{" "}
                  <span className="text-green-600">{feature.properties.ESTADO}</span>
                </p>
                <p>
                  <b>Unidad Hidrográfica:</b> {feature.properties.NombreUH}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <a
                  href={feature.properties.RPT_ICARHS}
                  target="_blank"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Ver Reporte ICARHS
                </a>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
