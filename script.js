const chatOutput = document.getElementById("chat-output");
const inputField = document.getElementById("entrada");
const sendButton = document.getElementById("enviar");

let conversationStep = 1; // Inicio en 1 para solicitar los medicamentos directamente
let userDrugs = []; // Lista de medicamentos ingresados por el usuario

// Base de datos de medicamentos (interacciones e información)
const mockDatabase = {
  aspirina: {
    interacciones: ["ibuprofeno", "warfarina"],
    info: "Se utiliza para reducir el dolor, la fiebre y la inflamación."
  },
  paracetamol: {
    interacciones: ["alcohol"],
    info: "Se usa para aliviar el dolor leve a moderado y reducir la fiebre."
  },
  ibuprofeno: {
    interacciones: ["aspirina"],
    info:
      "Un antiinflamatorio no esteroideo usado para tratar el dolor y la inflamación."
  },
  metformina: {
    interacciones: ["alcohol"],
    info: "Medicamento para tratar la diabetes tipo 2."
  },
  amoxicilina: {
    interacciones: ["alopurinol"],
    info: "Antibiótico para infecciones bacterianas."
  },
  losartan: {
    interacciones: ["litio"],
    info: "Usado para tratar la hipertensión."
  },
  omeprazol: {
    interacciones: ["clopidogrel"],
    info:
      "Reduce la cantidad de ácido producido en el estómago, no produce una capa protectora."
  },
  simvastatina: {
    interacciones: ["gemfibrozilo"],
    info: "Usada para reducir el colesterol y los triglicéridos."
  },
  alopurinol: {
    interacciones: ["azatioprina"],
    info: "Ayuda a reducir los niveles de ácido úrico en la sangre."
  },
  warfarina: {
    interacciones: ["aspirina"],
    info: "Anticoagulante usado para prevenir coágulos sanguíneos."
  },
  atorvastatina: {
    interacciones: ["gemfibrozilo", "eritromicina"],
    info:
      "Reduce el colesterol y ayuda a prevenir enfermedades cardiovasculares."
  },
  tramadol: {
    interacciones: ["alcohol", "benzodiazepinas"],
    info: "Analgésico opioide usado para tratar el dolor moderado a severo."
  },
  cefalexina: {
    interacciones: ["probenecid"],
    info: "Antibiótico utilizado para infecciones bacterianas."
  },
  furosemida: {
    interacciones: ["digoxina", "litio"],
    info: "Diurético utilizado para tratar edemas e hipertensión."
  },
  ranitidina: {
    interacciones: ["ketoconazol"],
    info: "Usado para reducir el ácido en el estómago."
  },
  prednisona: {
    interacciones: ["ibuprofeno", "aspirina"],
    info: "Corticosteroide utilizado para tratar inflamaciones y alergias."
  },
  enalapril: {
    interacciones: ["litio", "diuréticos"],
    info: "Inhibidor de la ECA usado para tratar la hipertensión."
  },
  azitromicina: {
    interacciones: ["warfarina"],
    info: "Antibiótico usado para infecciones bacterianas."
  },
  clopidogrel: {
    interacciones: ["omeprazol"],
    info: "Anticoagulante utilizado para prevenir coágulos sanguíneos."
  },
  diclofenaco: {
    interacciones: ["ibuprofeno", "aspirina"],
    info: "Antiinflamatorio usado para tratar el dolor y la inflamación."
  },
  enoxaparina: {
    interacciones: ["ibuprofeno", "diclofenaco"],
    info: "Anticoagulante usado para evitar formación de trombosis."
  }
};

// Saludo inicial con solicitud directa de medicamentos
appendMessage(
  "¡Hola! Soy tu asistente virtual de salud. 😊 Por favor, dime los nombres de los medicamentos que estás tomando o sobre los que tienes dudas.",
  "bot"
);

// Evento de enviar
sendButton.addEventListener("click", async () => {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, "user"); // Mostrar mensaje del usuario
  const botResponse = await getBotResponse(userMessage);
  appendMessage(botResponse, "bot"); // Mostrar respuesta del bot
  inputField.value = ""; // Limpiar campo
});

// Función para mostrar mensajes
function appendMessage(message, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = message;
  chatOutput.appendChild(messageDiv);
  chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll automático
}

// Función principal del chatbot
async function getBotResponse(userInput) {
  // Detectar comando de reinicio
  if (/reiniciar/i.test(userInput)) {
    return resetConversation();
  }

  const greetings = [
    "hola",
    "buenos días",
    "buenas tardes",
    "buenas noches",
    "qué tal",
    "hi"
  ];

  // Detectar saludos y solicitar medicamentos si no se ha hecho
  if (
    conversationStep === 1 &&
    greetings.some((greet) => userInput.toLowerCase().includes(greet))
  ) {
    return "¡Hola de nuevo! Por favor, dime los medicamentos que tomas para ayudarte mejor.";
  }

  // Flujo para solicitar medicamentos
  if (conversationStep === 1) {
    const drugs = userInput
      .toLowerCase()
      .split(/[,\s]+/)
      .map((drug) => drug.trim())
      .filter((drug) => drug);

    if (drugs.length === 0) {
      return "Por favor, ingresa al menos un medicamento.";
    }

    userDrugs = drugs;
    conversationStep = 2;
    return `Gracias. Mencionaste: ${drugs.join(
      ", "
    )}. ¿Quieres buscar interacciones o información general?, si deseas información digita "información", si quieres saber si dichos medicamentos tienen interacciones importantes escribe "interacciones"`;
  }

  // Flujo para seleccionar interacciones o información general
  if (conversationStep === 2) {
    if (/interacciones/i.test(userInput)) {
      return checkDrugInteractions(userDrugs);
    }
    if (/información/i.test(userInput)) {
      return getDrugInformation(userDrugs);
    }

    return "No entendí. ¿Deseas buscar interacciones o información general sobre los medicamentos?";
  }

  return "No estoy seguro de cómo ayudarte con eso. Intenta ser más específico.";
}

// Función para verificar interacciones de medicamentos
function checkDrugInteractions(drugs) {
  let responses = [];

  // Comparar cada medicamento con los demás
  drugs.forEach((drug, index) => {
    const data = mockDatabase[drug];
    if (data && data.interacciones) {
      drugs.forEach((otherDrug, otherIndex) => {
        if (index !== otherIndex && data.interacciones.includes(otherDrug)) {
          responses.push(
            `⚠️ Interacción detectada entre ${drug} y ${otherDrug}. Consulta a tu médico.`
          );
        }
      });
    }
  });

  if (responses.length > 0) {
    return responses.join("\n");
  }
  return "No encontré interacciones conocidas entre los medicamentos mencionados.";
}

// Función para obtener información general sobre medicamentos
function getDrugInformation(drugs) {
  const infoResponses = [];

  // Filtrar y proporcionar información solo de los medicamentos mencionados
  drugs.forEach((drug) => {
    const data = mockDatabase[drug];
    if (data && data.info) {
      infoResponses.push(`${drug}: ${data.info}`);
    }
  });

  // Solo mostrar la información relevante de los medicamentos mencionados
  if (infoResponses.length > 0) {
    return infoResponses.join("\n");
  }

  return "No tengo información sobre los medicamentos mencionados.";
}

// Función para restablecer la conversación
function resetConversation() {
  conversationStep = 1;
  userDrugs = [];
  return "La conversación ha sido reiniciada. 😊 Por favor, dime los nombres de los medicamentos que estás tomando o sobre los que tienes dudas.";
}
