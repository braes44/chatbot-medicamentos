const chatOutput = document.getElementById('chat-output');
const inputField = document.getElementById('entrada');
const sendButton = document.getElementById('enviar');

let conversationStep = 0; // Controla el flujo de conversación
let userDrugs = []; // Lista de medicamentos ingresados por el usuario

// Base de datos de medicamentos (interacciones e información)
const mockDatabase = {
  aspirina: {
    interacciones: ['ibuprofeno', 'warfarina'],
    info: 'Se utiliza para reducir el dolor, la fiebre y la inflamación.',
  },
  paracetamol: {
    interacciones: ['alcohol'],
    info: 'Se usa para aliviar el dolor leve a moderado y reducir la fiebre.',
  },
  ibuprofeno: {
    interacciones: ['aspirina'],
    info: 'Un antiinflamatorio no esteroideo usado para tratar el dolor y la inflamación.',
  },
  metformina: {
    interacciones: ['alcohol'],
    info: 'Medicamento para tratar la diabetes tipo 2.',
  },
  amoxicilina: {
    interacciones: ['alopurinol'],
    info: 'Antibiótico para infecciones bacterianas.',
  },
  losartan: {
    interacciones: ['litio'],
    info: 'Usado para tratar la hipertensión.',
  },
  omeprazol: {
    interacciones: ['clopidogrel'],
    info: 'Reduce la cantidad de ácido producido en el estómago.',
  },
  simvastatina: {
    interacciones: ['gemfibrozilo'],
    info: 'Usada para reducir el colesterol y los triglicéridos.',
  },
  alopurinol: {
    interacciones: ['azatioprina'],
    info: 'Ayuda a reducir los niveles de ácido úrico en la sangre.',
  },
  warfarina: {
    interacciones: ['aspirina'],
    info: 'Anticoagulante usado para prevenir coágulos sanguíneos.',
  },
};

// Saludo inicial
appendMessage('¡Hola! Soy tu asistente virtual de salud. ¿Cómo puedo ayudarte hoy? 😊', 'bot');

// Evento de enviar
sendButton.addEventListener('click', async () => {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, 'user'); // Mostrar mensaje del usuario
  const botResponse = await getBotResponse(userMessage);
  appendMessage(botResponse, 'bot'); // Mostrar respuesta del bot
  inputField.value = ''; // Limpiar campo
});

// Función para mostrar mensajes
function appendMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = message;
  chatOutput.appendChild(messageDiv);
  chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll automático
}

// Función principal del chatbot
async function getBotResponse(userInput) {
  const greetings = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'qué tal', 'hi'];

  // Detectar saludos
  if (greetings.some(greet => userInput.toLowerCase().includes(greet))) {
    return '¡Hola! ¿Cómo puedo ayudarte hoy? Si quieres, dime los medicamentos que estás tomando o alguna duda que tengas sobre ellos.';
  }

  // Flujo de conversación
  if (conversationStep === 0) {
    conversationStep = 1;
    return 'Dime los nombres de los medicamentos que estás tomando o sobre los que tienes dudas.';
  }

  if (conversationStep === 1) {
    const drugs = userInput
      .toLowerCase()
      .split(/[,\s]+/)
      .map(drug => drug.trim())
      .filter(drug => drug);

    if (drugs.length === 0) {
      return 'Por favor, ingresa al menos un medicamento.';
    }

    userDrugs = drugs;
    conversationStep = 2;
    return `Gracias. Mencionaste: ${drugs.join(', ')}. ¿Quieres buscar interacciones o información general?`;
  }

  if (conversationStep === 2) {
    if (/interacciones/i.test(userInput)) {
      return checkDrugInteractions(userDrugs);
    }
    if (/información/i.test(userInput)) {
      return getDrugInformation(userDrugs);
    }

    return 'No entendí. ¿Deseas buscar interacciones o información general sobre los medicamentos?';
  }

  return 'No estoy seguro de cómo ayudarte con eso. Intenta ser más específico.';
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
    return responses.join('\n');
  }
  return 'No encontré interacciones conocidas entre los medicamentos mencionados.';
}

// Función para obtener información general sobre medicamentos
function getDrugInformation(drugs) {
  const infoResponses = [];

  // Filtrar y proporcionar información solo de los medicamentos mencionados
  drugs.forEach(drug => {
    const data = mockDatabase[drug];
    if (data && data.info) {
      infoResponses.push(`${drug}: ${data.info}`);
    } else {
      infoResponses.push(`${drug}: No tengo información sobre este medicamento.`);
    }
  });

  // Solo mostrar la información relevante de los medicamentos mencionados
  return infoResponses.length > 0 ? infoResponses.join('\n') : 'No tengo información sobre los medicamentos mencionados.';
}
