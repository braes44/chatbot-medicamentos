// Inicializar variables
const chatOutput = document.getElementById('chat-output');
const inputField = document.getElementById('entrada');
const sendButton = document.getElementById('enviar');

// Estado del flujo de conversación
let conversationStep = 0; // Controla en qué parte del flujo está el usuario
let userDrugs = []; // Lista de medicamentos ingresados por el usuario

// Evento de enviar
sendButton.addEventListener('click', async () => {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  // Mostrar mensaje del usuario
  appendMessage(userMessage, 'user');

  // Procesar respuesta del bot
  const botResponse = await getBotResponse(userMessage);
  appendMessage(botResponse, 'bot');

  // Limpiar campo de entrada
  inputField.value = '';
});

// Función para mostrar mensajes en el chat
function appendMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = message;
  chatOutput.appendChild(messageDiv);
  chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll automático
}

// Mensaje inicial del bot
appendMessage('¡Hola! Soy tu asistente virtual de salud. ¿En qué puedo ayudarte hoy?', 'bot');

// Función principal del chatbot
async function getBotResponse(userInput) {
  // Flujo de conversación basado en pasos
  if (conversationStep === 0) {
    conversationStep = 1; // Avanzar en el flujo
    return 'Primero, dime los nombres de los medicamentos que estás tomando o sobre los que tienes dudas.';
  }

  if (conversationStep === 1) {
    // Separar medicamentos ingresados por el usuario
    const drugs = userInput
      .toLowerCase()
      .split(/\s|,|y/)
      .map((drug) => drug.trim())
      .filter((drug) => drug);

    if (drugs.length === 0) {
      return 'Por favor, ingresa al menos un medicamento.';
    }

    userDrugs = drugs; // Guardar medicamentos ingresados
    conversationStep = 2; // Avanzar en el flujo
    return `Entendido. Has mencionado: ${drugs.join(', ')}. Ahora, dime si deseas buscar interacciones o información específica sobre estos medicamentos.`;
  }

  if (conversationStep === 2) {
    // Responder según la intención del usuario (interacciones o información)
    if (userInput.toLowerCase().includes('interacciones')) {
      return checkDrugInteractions(userDrugs);
    }

    if (userInput.toLowerCase().includes('información')) {
      return `Actualmente, no tengo detalles específicos sobre medicamentos. Sin embargo, puedo ayudarte a buscar interacciones. ¿Quieres buscar interacciones entre los medicamentos?`;
    }

    return '¿Podrías aclarar si deseas buscar interacciones o información específica sobre los medicamentos?';
  }

  // Respuesta predeterminada
  return 'No tengo suficiente información sobre eso, pero sigo aprendiendo.';
}

// Simulación de búsqueda de interacciones de medicamentos
function checkDrugInteractions(drugs) {
  const mockDatabase = {
    'losartán': ['ibuprofeno', 'aspirina'],
    'aspirina': ['ibuprofeno', 'losartán'],
    'ibuprofeno': ['aspirina', 'losartán'],
    'paracetamol': ['alcohol'],
  };

  const interactions = [];
  drugs.forEach((drug) => {
    const conflicts = mockDatabase[drug];
    if (conflicts) {
      conflicts.forEach((conflict) => {
        if (drugs.includes(conflict)) {
          interactions.push(`${drug} y ${conflict}`);
        }
      });
    }
  });

  if (interactions.length > 0) {
    return `Interacciones detectadas: ${interactions.join(', ')}. Por favor, consulta a tu médico antes de tomar estos medicamentos juntos.`;
  }

  return 'No encontré interacciones conocidas entre los medicamentos que mencionaste.';
}
