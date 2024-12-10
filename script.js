const chatOutput = document.getElementById("chat-output");
const inputField = document.getElementById("entrada");
const sendButton = document.getElementById("enviar");

let conversationStep = 1; // Inicio en 1 para solicitar los medicamentos directamente
let userDrugs = []; // Lista de medicamentos ingresados por el usuario

// Base de datos de medicamentos (interacciones e información)
const mockDatabase = {
  aspirina: {
    interacciones: ["ibuprofeno", "warfarina"],
    info: "Se utiliza para reducir el dolor, la fiebre y la inflamación, dependiendo de la dosis funciona como  anticoagulante oral, tener cuidado en caso de estar en terapia con anticoagulantes"
  },
  paracetamol: {
    interacciones: ["alcohol"],
    info: "Se usa para aliviar el dolor leve a moderado y reducir la fiebre."
    info: "Se usa para aliviar el dolor leve a moderado y reducir la fiebre, no exceder los 8 gramos en el dia."
  },
  Acetaminofen: {
    interacciones: ["alcohol"],
    info: "Se usa para aliviar el dolor leve a moderado y reducir la fiebre, no exceder los 8 gramos en el dia."
  },
  ibuprofeno: {
    interacciones: ["aspirina"],
    info:
      "Un antiinflamatorio no esteroideo usado para tratar el dolor y la inflamación."
      "Un antiinflamatorio no esteroideo usado para tratar el dolor y la inflamación, no se recomienda sostener el tratamiento por mas de 7 dias, puede generar malestar gatrico."
  },
  metformina: {
    interacciones: ["alcohol"],
    info: "Medicamento para tratar la diabetes tipo 2, dentro de sus reacciones adversas mas comunes se encuentra la diarrea normalmente al inicio del tratamiento, no mezclar con bebidas alcoholicas"
  },
  amoxicilina: {
    interacciones: ["alopurinol"],
    info: "Antibiótico para infecciones bacterianas."
    info: "Antibiótico para infecciones bacterianas, los antibioticos deben ser prescritos bajo formula medica, no se recomienda la automedicación debido a la resistencia a patogenos despues de su uso."
  },
  losartan: {
    interacciones: ["litio"],
@@ -60,7 +64,7 @@
  },
  cefalexina: {
    interacciones: ["probenecid"],
    info: "Antibiótico utilizado para infecciones bacterianas, no tomar en caso de presentar alergias a las penicilinas"
    info: "Antibiótico utilizado para infecciones bacterianas, no tomar en caso de presentar alergias a las penicilinas, los antibioticos deben ser prescritos bajo formula medica, no se recomienda la automedicación debido a la resistencia a patogenos despues de su uso"
  },
  furosemida: {
    interacciones: ["digoxina", "litio"],
@@ -80,174 +84,174 @@
  },
  azitromicina: {
    interacciones: ["warfarina"],
    info: "Antibiótico usado para infecciones bacterianas."
    info: "Antibiótico usado para infecciones bacterianas, , los antibioticos deben ser prescritos bajo formula medica, no se recomienda la automedicación debido a la resistencia a patogenos despues de su uso"
  },
  clopidogrel: {
    interacciones: ["omeprazol"],
    info: "Anticoagulante utilizado para prevenir coágulos sanguíneos."
  },
  diclofenaco: {
    interacciones: ["ibuprofeno", "aspirina"],
    info: "Antiinflamatorio usado para tratar el dolor y la inflamación, dentro de sus reacciones adversas mas comunes se encuentra el reflujo gastroesofagico."
  },
  enoxaparina: {
    interacciones: ["ibuprofeno", "diclofenaco"],
    info: "Anticoagulante usado para evitar formación de trombosis, tener cuidado con la dosis resetada por el medico tratante, no repetir dosis en caso de olvido, parar el tratamiento en caso de aparición de morados o sangrado de algun tipo"

 },
  gemfibrozilo: {
    interacciones: ["simvastatina", "atorvastatina"],
    info: "El gemfibrozilo se usa junto con cambios en la dieta (restricción de la ingesta de colesterol y grasas) para reducir la cantidad de colesterol y triglicéridos (otras sustancias grasas) presentes en la sangre en ciertas personas con concentraciones muy altas de triglicéridos"

 },
  digoxina: {
    interacciones: ["Omeprazol", "amiodarona"],
    info: "Medicamento que se usa para tratar el latido cardiaco irregular y algunos tipos de insuficiencia cardíaca, algunos efectos secundarios a tener en cuenta son el mareo y la somnolencia, se recomienda seguir paso a paso las recomendaciones en la prescripción medica."

 },
  espironolactona: {
    interacciones: ["colchicina", "digoxina"],
    info: "Se indica en algunos casos para la insuficiencia cardiaca, hipertensión o hipocalcemia, si sufre insuficiencia renal debe consultar con un profesional sanitario en caso de requerir el uso del medicamento."

 },
  litio: {
    interacciones: ["colchicina", "digoxina"],
    info: "El litio es un estabilizador del estado de ánimo que se utiliza para tratar o controlar los episodios maníacos del trastorno bipolar ( depresión maníaca ). Sus principales efectos secundarios son: somnolencia o espasmos, en caso de que estos sintomas empeoren pare el medicamento y consulte en urgencias de su ciudad "

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
