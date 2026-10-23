const { SerialPort, ReadlineParser } = require("serialport");


const puerto = new SerialPort({
  path: "COM3",
  baudRate: 9600,
});


const lector = puerto.pipe(
  new ReadlineParser({ delimiter: "\n" })
);


puerto.on("open", () => {
  console.log("Conectado a COM3. Esperando datos...");
});


const API = "https://soli-olive.vercel.app";
const ID_MESA = 1;
const TIPOS = ["mozo", "cuenta", "pan", "menu", "cancelar"];

let prioridadHasta = 0;

lector.on("data", async (linea) => {
  const tipo = linea.trim().toLowerCase();

  if (tipo === "prioridad") {
    prioridadHasta = Date.now() + 5000;
    console.log("Prioridad armada por 5 segundos");
    return;
  }

  if (!TIPOS.includes(tipo)) return;

  const prioridad = Date.now() < prioridadHasta;
  prioridadHasta = 0;

  try {
    const respuesta = await fetch(API + "/solicitudes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, id_mesa: ID_MESA, prioridad }),
    });
    const datos = await respuesta.json();
    console.log("Enviado:", tipo, prioridad ? "(PRIORIDAD)" : "", "→", respuesta.status, datos);
  } catch (err) {
    console.error("No se pudo mandar al back:", err.message);
  }
});


puerto.on("error", (error) => {
  console.error("Error en COM3:", error.message);
  process.exitCode = 1;
});


puerto.on("close", () => {
  console.log("Puerto desconectado.");
});

