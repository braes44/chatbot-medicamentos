const chatOutput = document.getElementById("chat-output");
const inputField = document.getElementById("entrada");
const sendButton = document.getElementById("enviar");

let conversationStep = 1; // Inicio en 1 para solicitar los medicamentos directamente
let userDrugs = []; // Lista de medicamentos ingresados por el usuario

// Base de datos de medicamentos (interacciones e información)
const mockDatabase = {
  aspirina: {
    interacciones: ["ibuprofeno", "warfarina","apixaban"],
    info: "Se utiliza para reducir el dolor, la fiebre y la inflamación, dependiendo de la dosis funciona como  anticoagulante oral, tener cuidado en caso de estar en terapia con otros anticoagulantes."
  },
  paracetamol: {
    interacciones: ["alcohol"],
    info: "Se usa para aliviar el dolor leve a moderado y reducir la fiebre, no exceder los 8 gramos en el dia."
  },
  Acetaminofen: {
    interacciones: ["alcohol"],
    info: "Se usa para aliviar el dolor leve a moderado y reducir la fiebre, no exceder los 8 gramos en el dia."

  },
  Dipirona: {
    interacciones: ["Ciclosporina"],
    info: "Analgésico, antipirético de segunda línea en casos de dolor o fiebre moderados o severos que no han cedido a otras alternativas farmacológicas, muy usado en crisis de migraña, no usar por mas del tiempo recetado por su medico, en caso de presentar alergias suspenda inmediatamente."
  },
  ibuprofeno: {
    interacciones: ["aspirina"],
    info: "Un antiinflamatorio no esteroideo usado para tratar el dolor y la inflamación, no se recomienda sostener el tratamiento por mas de 7 dias, puede generar malestar gatrico."
  },
  metformina: {
    interacciones: ["alcohol"],
    info: "Medicamento para tratar la diabetes tipo 2, dentro de sus reacciones adversas mas comunes se encuentra la diarrea normalmente al inicio del tratamiento, no mezclar con bebidas alcoholicas"
  },
  amoxicilina: {
    interacciones: ["alopurinol"],
    info: "Antibiótico para infecciones bacterianas, los antibioticos deben ser prescritos bajo formula medica, no se recomienda la automedicación debido a la resistencia a patogenos despues de su uso."
  },
  losartan: {
    interacciones: ["litio"],
    info: "Usado para tratar la hipertensión."
  },
  omeprazol: {
    interacciones: ["clopidogrel"],
    info:      "Reduce la cantidad de ácido producido en el estómago, no produce una capa protectora, en caso de estar tomando vitaminas puede reducir su absorcion, su uso por mas de 2 años debe ser reeevaluado por un profesional sanitario"
  },
  Esomeprazol: {
    interacciones: ["escitalopram"],
    info:      "Reduce la cantidad de ácido producido en el estómago, no produce una capa protectora, en caso de estar tomando vitaminas puede reducir su absorcion, su uso por mas de 2 años debe ser reeevaluado por un profesional sanitario"
  },
  simvastatina: {
    interacciones: ["gemfibrozilo"],
    info: "Usada para reducir el colesterol y los triglicéridos."

  },
  Bisacodilo: {
    interacciones: ["Contumax"],
    info: "El bisacodilo se usa a corto plazo para tratar el estreñimiento. También se usa para evacuar el intestino antes de una cirugía y de determinados procedimientos médicos, no se recomienda su uso con otros laxantes debido al riesgo de daño de la mucosa del intestino, en caso de presentar malestar estomacal o sangrado suspenda el medicamento e informe a su medico."
  },
  alopurinol: {
    interacciones: ["azatioprina"],
    info: "Ayuda a reducir los niveles de ácido úrico en la sangre."
  },
  warfarina: {
    interacciones: ["aspirina", "apixaban"],
    info: "Anticoagulante usado para prevenir coágulos sanguíneos, se recomienda evitar el uso de bebidas verdes, ya que reducen el efecto del medicamento, si usa suplementos o vitaminas informe a su medico."
  },
  atorvastatina: {
    interacciones: ["gemfibrozilo", "eritromicina"],
    info: "Reduce el colesterol y ayuda a prevenir enfermedades cardiovasculares, se debe tener cuidado con este medicamento en personas mayores debido al riesgo de deterioro muscular que puede causar durante tiempos de uso prolongados, si refiere malestar muscular se recomienda consultar a su medico."
  },
  tramadol: {
    interacciones: ["alcohol", "benzodiazepinas"],
    info: "Analgésico opioide usado para tratar el dolor moderado a severo, este medicamento puede causar sudoraciones nocturnas, mareo, vomito, en caso de no tolerarlo se recomienda suspenderlo y consultar a su medico."
  },
  cefalexina: {
    interacciones: ["probenecid"],
    info: "Antibiótico utilizado para infecciones bacterianas, no tomar en caso de presentar alergias a las penicilinas, los antibioticos deben ser prescritos bajo formula medica, no se recomienda la automedicación debido a la resistencia a patogenos despues de su uso"
  },
  furosemida: {
    interacciones: ["digoxina", "litio"],
    info: "Diurético utilizado para tratar edemas e hipertensión."
  },
  ranitidina: {
    interacciones: ["ketoconazol"],
    info: "Usado para reducir el ácido en el estómago."

  },
  celecoxib: {
    interacciones: ["ketorolaco","ibuprofeno", "naproxeno","etoricoxib"],
    info: "Analgesico, antiflamatorio, se recomienda solo usara por maximo 7 dias, en caso de presentar molestias estomacales, considerar suspender su uso y consultar con su medico."

  },
  contumax: {
    interacciones: ["Bisacodilo"],
    info: "Tratamiento de la Constipación, puede generar flatulencias, calambres estomacales, no se recomienda tomar con otros laxantes"
  },
  etoricoxib: {
    interacciones: ["ketorolaco","ibuprofeno", "naproxeno", "celecoxib"],
    info: "Analgesico, antiflamatorio, se recomienda solo usara por maximo 7 dias, en caso de presentar molestias estomacales, considerar suspender su uso y consultar con su medico."
  },
  metronidazol: {
    interacciones: ["ketoconazol", "warfarina","fenitoina"],
    info: "El metronidazol se usa para tratar infecciones del aparato reproductor, el tracto gastrointestinal, siempre debe ser recetado por un profesional sanitario, se debe restringir la ingesta de alcohol durante el tratamiento"
  },
  Fluconazol: {
    interacciones: ["ketoconazol", "warfarina","fenitoina"],
    info: "El fluconazol se usa para tratar infecciones del aparato reproductor, el tracto gastrointestinal, siempre debe ser recetado por un profesional sanitario, se debe restringir la ingesta de alcohol durante el tratamiento"
  
  },
  ketoconazol: {
    interacciones: ["alcohol"],
    info: "El ketoconazol es un medicamento que se utiliza para tratar infecciones causadas por hongos, esta extremadamente restringido su uso si se esta consumiendo alcohol, no se recomienda su uso en mujeres embarazadas, debe ser prescrito por un profesional sanitario."
  },
  prednisona: {
    interacciones: ["ibuprofeno", "aspirina"],
    info: "Corticosteroide utilizado para tratar inflamaciones y alergias, tener cuidado con su uso prolongado y la dosis, siempre debe ser orientado su uso por un profesional sanitario."
  },
  enalapril: {
    interacciones: ["litio", "diuréticos"],
    info: "Inhibidor de la ECA usado para tratar la hipertensión, en caso de presentar tos que no para, informe a su medico"
  },
  azitromicina: {
    interacciones: ["warfarina"],
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
  amlodipino: {
    interacciones: ["claritromicina"],
    info: "Antihipertensivo, antianginoso (prevenir y tratar la cardiopatia isquemica y la angina de pecho) y coadyuvante en pacientes con enfermedad arterial coronaria. "
  },
  acido tranexamico: {
    interacciones: ["claritromicina"],
    info: "Está indicado en el tratamiento y la profilaxis de las hemorragias por cirugias o enfermedades autoimunes, evitar la automedicación con este medicamento, debe ser recetado por un profesional sanitario "
  },
  enoxaparina: {
    interacciones: ["ibuprofeno", "diclofenaco"],
    info: "Anticoagulante usado para evitar formación de trombosis, tener cuidado con la dosis resetada por el medico tratante, no repetir dosis en caso de olvido, parar el tratamiento en caso de aparición de morados o sangrado de algun tipo"

  },
  apixaban: {
    interacciones: ["amiodarona","warfarina", "rivaroxaban"],
    info: " Anticoagulante que se utiliza para ayudar a prevenir accidentes cerebrovasculares o coágulos sanguíneos en personas con fibrilación auricular, este medicamento debe ser recomendado por un profesional sanitario, en caso de sangrado anormal se debe suspender el tratamiento, se debe tener extremo cuidado en caso de sobredosis."
 },
  rivaroxaban: {
    interacciones: ["amiodarona","warfarina", "apixaban"],
    info: " Anticoagulante que se utiliza para ayudar a prevenir accidentes cerebrovasculares o coágulos sanguíneos en personas con fibrilación auricular, este medicamento debe ser recomendado por un profesional sanitario, en caso de sangrado anormal se debe suspender el tratamiento, se debe tener extremo cuidado en caso de sobredosis."
 },
  },
  gemfibrozilo: {
    interacciones: ["simvastatina", "atorvastatina"],
    info: "El gemfibrozilo se usa junto con cambios en la dieta (restricción de la ingesta de colesterol y grasas) para reducir la cantidad de colesterol y triglicéridos (otras sustancias grasas) presentes en la sangre en ciertas personas con concentraciones muy altas de triglicéridos"

 },
  digoxina: {
    interacciones: ["Omeprazol", "amiodarona"],
    info: "Medicamento que se usa para tratar el latido cardiaco irregular y algunos tipos de insuficiencia cardíaca, algunos efectos secundarios a tener en cuenta son el mareo y la somnolencia, se recomienda seguir paso a paso las recomendaciones en la prescripción medica."
 },
  gaviscon: {
    interacciones: ["doxiciclina", "digoxina"],
    info: "antiacido, se recomienda no tomar vitaminas si esta usando este medicamento, puede reducir la absorción de otros medicamentos si se administran via oral al mismo tiempo."

 },
  quetiapina: {
    interacciones: ["fluconazol", "eritromicina"],
    info: "Se usa como coadyudante del sueño y para tratar algunos trastornos psiquiatricos, siempre se debe usar acorde a tratamiento medico, no se recomienda la automedicación, tener cuidado si se esta tomando antibioticos o algun tratamiento para los hongos, en caso tal se debe informa a su medico."
 },
  zopiclona: {
    interacciones: ["alcohol"],
    info: "Se usa como coadyudante del sueño y para tratar algunos trastornos psiquiatricos, siempre se debe usar acorde a tratamiento medico, no se recomienda la automedicación."
 },
  espironolactona: {
    interacciones: ["colchicina", "digoxina"],
    info: "Se indica en algunos casos para la insuficiencia cardiaca, hipertensión o hipocalcemia, si sufre insuficiencia renal debe consultar con un profesional sanitario en caso de requerir el uso del medicamento."
 },
  cetrizina: {
    interacciones: ["alcohol", "difenhidramina"],
    info: "se utiliza para tratar la urticaria aguda en adultos y niños de 6 meses en adelante. Pertenece a una clase de medicamentos llamados antihistamínicos. Su función consiste en bloquear la acción de la histamina, una sustancia en el cuerpo que causa los síntomas de la alergia"
 }, 
  hidroxicina: {
    interacciones: ["alcohol", "difenhidramina"],
    info: "se utiliza para tratar la urticaria aguda en adultos y niños de 6 meses en adelante. La cetirizina pertenece a una clase de medicamentos llamados antihistamínicos. Su función consiste en bloquear la acción de la histamina, una sustancia en el cuerpo que causa los síntomas de la alergia"

 }, 
  difenhidramina: {
    interacciones: ["alcohol", "difenhidramina"],
    info: "se utiliza para tratar la urticaria aguda en adultos y niños de 6 meses en adelante. La cetirizina pertenece a una clase de medicamentos llamados antihistamínicos. Su función consiste en bloquear la acción de la histamina, una sustancia en el cuerpo que causa los síntomas de la alergia"   
  },
  hidrocolorotiazida: {
    interacciones: ["colchicina", "digoxina"],
    info: "Se indica en algunos casos para la insuficiencia cardiaca, hipertensión o hipocalcemia, se recomienda tomar en ayunas, si sufre insuficiencia renal debe consultar con un profesional sanitario en caso de requerir el uso del medicamento."
 },
  Metoprolol: {
    interacciones: ["nifedipino", "diltiazem","aspirina"],
    info: "Se usa solo o en combinación con otros medicamentos para tratar la presión arterial alta. También se usa para tratar el ritmo cardíaco, siempre se debe seguir la indicación segun medico tratante. "    
 },
  Propanolol: {
    interacciones: ["nifedipino", "diltiazem","aspirina"],
    info: "El propranolol se usa solo o en combinación con otros medicamentos para tratar la presión arterial alta. También se usa para tratar el ritmo cardíaco, en algunos casos se usa para reducir la ansiedad, siempre se debe seguir la indicación segun medico tratante "    
  },
  litio: {
    interacciones: ["colchicina", "digoxina"],
    info: "El litio es un estabilizador del estado de ánimo que se utiliza para tratar o controlar los episodios maníacos del trastorno bipolar ( depresión maníaca ). Sus principales efectos secundarios son: somnolencia o espasmos, en caso de que estos sintomas empeoren pare el medicamento y consulte en urgencias de su ciudad "
 },
  clonidina: {
    interacciones: ["verapamilo", "digoxina","propanolol"],
    info: "La clonidina trata la presión arterial alta disminuyendo la frecuencia cardíaca y relajando los vasos sanguíneos para que la sangre pueda fluir, tener cuidado con su uso dado que ocasiona facilmente hipotensión, mareos, se debe administrar bajo supervisión. "
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
    "holi"
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
    )}. ¿Quieres buscar interacciones o información general?, si deseas información del medicamento escribe en el chat "información", si quieres saber si dichos medicamentos tienen interacciones importantes escribe en este chat "interacciones"`;
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
  return "No encontré interacciones conocidas entre los medicamentos mencionados, si despues de tomar un medicamento presenta enrojecimiento en zonas de su piel, inflamación en los ojos, dificultad para respirar, suspenda inmediatamente y dirijase al centro de salud mas cercano. Si despues de tomar su medicamento presenta malestares extraños o que atenten con su integridad, suspenda el medicamento e informe a su medico o profesiona sanitario mas cercano..";
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

  return "No tengo información sobre los medicamentos mencionados, si despues de tomar un medicamento presenta enrojecimiento en zonas de su piel, inflamación en los ojos, dificultad para respirar, suspenda inmediatamente y dirijase al centro de salud mas cercano. Si despues de tomar su medicamento presenta malestares extraños o que atenten con su integridad, suspenda el medicamento e informe a su medico o profesiona sanitario mas cercano.";
}

// Función para restablecer la conversación
function resetConversation() {
  conversationStep = 1;
  userDrugs = [];
  return "La conversación ha sido reiniciada. 😊 Por favor, dime los nombres de los medicamentos que estás tomando o sobre los que tienes dudas.";
}
