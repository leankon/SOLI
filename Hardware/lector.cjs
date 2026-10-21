const { SerialPort, ReadlineParser } = require("serialport");


const puerto = new SerialPort({
  path: "COM5",
  baudRate: 9600,
});


const lector = puerto.pipe(
  new ReadlineParser({ delimiter: "\n" })
);


puerto.on("open", () => {
  console.log("Conectado a COM3. Esperando datos...");
});


lector.on("data", (linea) => {
  console.log(linea.trimEnd());
});


puerto.on("error", (error) => {
  console.error("Error en COM3:", error.message);
  process.exitCode = 1;
});


puerto.on("close", () => {
  console.log("Puerto desconectado.");
});

