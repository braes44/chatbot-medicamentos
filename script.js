const chatOutput = document.getElementById('chat-output');
const inputField = document.getElementById('entrada');
const sendButton = document.getElementById('enviar');

// Estado del flujo de conversación
let conversationStep = 0;
let userDrugs = [];

// Evento de enviar
sendButton.addEventListener('click', async () => {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, 'user');

  const botResponse = await getBotResponse(userMessage);
  appendMessage(botResponse, 'bot');

  inputField.value = '';
});

// Mostrar mensajes en el chat
function appendMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = message;
  chatOutput.appendChild(messageDiv);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

// Mensaje inicial del bot
appendMessage('¡Hola! Soy tu asistente virtual de medicamentos. ¿En qué puedo ayudarte hoy?', 'bot');

// Lógica principal del chatbot
async function getBotResponse(userInput) {
  if (conversationStep === 0) {
    conversationStep = 1;
    return 'Primero, dime los nombres de los medicamentos que estás tomando o sobre los que tienes dudas.';
  }

  if (conversationStep === 1) {
    const drugs = userInput
      .toLowerCase()
      .split(/[\s,]+/)
      .map((drug) => drug.trim())
      .filter((drug) => drug);

    if (drugs.length === 0) {
      return 'Por favor, ingresa al menos un medicamento.';
    }

    userDrugs = drugs;
    conversationStep = 2;
    return `Entendido. Has mencionado: ${drugs.join(', ')}. Ahora dime si deseas buscar interacciones o información específica.`;
  }

  if (conversationStep === 2) {
    if (userInput.toLowerCase().includes('interacciones')) {
      return checkDrugInteractions(userDrugs);
    }

    return '¿Podrías aclarar si deseas buscar interacciones o información sobre algún medicamento?';
  }

  return 'No tengo suficiente información sobre eso, pero sigo aprendiendo.';
}

// Simulación de búsqueda de interacciones
function checkDrugInteractions(drugs) {
  const mockDatabase = {
    losartan: ['ibuprofeno', 'paracetamol'],
    aspirina: ['warfarina', 'ibuprofeno'],
    metformina: ['alcohol', 'insulina'],
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

  return interactions.length > 0
    ? `Interacciones detectadas: ${interactions.join(', ')}. Por favor consulta a tu médico.`
    : 'No encontré interacciones conocidas con los medicamentos que mencionaste.';
}
