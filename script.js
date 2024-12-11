const chatOutput = document.getElementById("chat-output");
const inputField = document.getElementById("entrada");
const sendButton = document.getElementById("enviar");
const resetButton = document.getElementById("reiniciar"); // Botón de reinicio
const showDrugsButton = document.getElementById("mostrar-medicamentos"); // Botón para mostrar medicamentos

let conversationStep = 1; // Inicio en 1 para solicitar los medicamentos directamente
let userDrugs = []; // Lista de medicamentos ingresados por el usuario

// Base de datos de medicamentos (interacciones e información)
const mockDatabase = {
  aspirina: {
    interacciones: ["ibuprofeno", "warfarina", "apixaban", "rivaroxaban"],
    info: "Se utiliza para reducir el dolor, la fiebre y la inflamación."
  },
  paracetamol: {
    interacciones: ["alcohol"],
    info:
      "Se usa para aliviar el dolor leve a moderado y reducir la fiebre. No exceder los 8 gramos en el día."
  },
  digoxina: {
    interacciones: ["atorvastatina", "omeprazol", "esomeprazol", "neomicina"],
    info:
      "La digoxina se usa para tratar la insuficiencia y la frecuencia cardíaca anormal (arritmias). Ayuda a que el corazón funcione mejor y a controlar su frecuencia cardíaca"
  },
  acetaminofen: {
    interacciones: ["alcohol"],
    info:
      "Se usa para aliviar el dolor leve a moderado y reducir la fiebre. No exceder los 8 gramos en el día."
  },
  metoclopramida: {
    interacciones: ["morfina", "digoxina"],
    info:
      "La metoclopramida es un medicamento que se ha utilizado para tratar problemas de motilidad gastrointestinal, vomitos, nauseas, puede causar sintomas extrapiramidales y confusión.  "
  },

  acido_valproico: {
    interacciones: ["propofol", "imipenen", "meropenem"],
    info:
      "Medicamento que se usa para el tratamiento de las convulsiones epilépticas y el trastorno bipolar, se necesita tener cuidado con las presentaciones en el mercado como valproato o acido valproico, ya que pueden llevar al fracaso terapeutico en sindrome epileptico, preferiblemente tomar la misma marca de medicamento y si hay cambios consultar de inmediato con su medico o profesional sanitario. "
  },

  fluoxetina: {
    interacciones: ["aspirina", "cloroquina"],
    info:
      "La fluoxetina es un antidepresivo que se utiliza para tratar: Depresión, Trastorno obsesivo-compulsivo, se recomienda tomar en la mañana, no tome en la noche dado que puede causar insomnio, su efecto no aparece en las primeras dos semanas, siempre se debe tomar con seguimiento medico. "
  },

  vortioxetina: {
    interacciones: ["aspirina", "cloroquina"],
    info:
      "La fluoxetina es un antidepresivo que se utiliza para tratar: Depresión, Trastorno obsesivo-compulsivo, se recomienda tomar en la mañana, no tome en la noche dado que puede causar insomnio, su efecto no aparece en las primeras dos semanas, siempre se debe tomar con seguimiento medico. "
  },

  escitalopram: {
    interacciones: ["aspirina"],
    info:
      "Medicamento que se usa para el tratamiento de la depresión, se debe tomar segun prescripción medica, no suspender de repente, siempre se debe parar el tratamiento bajo seguimiento medico, no suspender en las primeras dos semanas de tratamiento debido a que puede causar efectos diferentes a los esperados. "
  },

  Sildenafil: {
    interacciones: ["Nitroglicerina"],
    info:
      "Es un medicamento que se utiliza para tratar la disfunción eréctil (DE) o impotencia en hombres y la hipertensión arterial pulmonar,  "
  },
  ritonavir: {
    interacciones: ["alcohol", "fenitoina", "cisaprida"],
    info:
      "El ritonavir se usa junto con otros medicamentos para tratar la infección por el virus de inmunodeficiencia humana (VIH),algunos efectos secundarios causados por los medicamentos contra el VIH son muy comunes y pueden durar solamente unos días o semanas. Por ejemplo, las náuseas, la fatiga y los trastornos del sueño son algunos de esos efectos secundarios a corto plazo, no suspenda el tratamiento por que el viruz puede volverse resistente "
  },
  atazanavir: {
    interacciones: ["alcohol", "fenitoina", "cisaprida"],
    info:
      "El atzanavir se usa junto con otros medicamentos para tratar la infección por el virus de inmunodeficiencia humana (VIH),algunos efectos secundarios causados por los medicamentos contra el VIH son muy comunes y pueden durar solamente unos días o semanas. Por ejemplo, las náuseas, la fatiga y los trastornos del sueño son algunos de esos efectos secundarios a corto plazo. no suspenda el tratamiento por que el viruz puede volverse resistente "
  },
  tenofovir: {
    interacciones: ["alcohol", "fenitoina", "cisaprida"],
    info:
      "El tenofovir se usa junto con otros medicamentos para tratar la infección por el virus de inmunodeficiencia humana (VIH),algunos efectos secundarios causados por los medicamentos contra el VIH son muy comunes y pueden durar solamente unos días o semanas. Por ejemplo, las náuseas, la fatiga y los trastornos del sueño son algunos de esos efectos secundarios a corto plazo, no suspenda el tratamiento por que el viruz puede volverse resistente "
  },
  entricitabina: {
    interacciones: ["alcohol", "fenitoina", "cisaprida"],
    info:
      "Se usa junto con otros medicamentos para tratar la infección por el virus de inmunodeficiencia humana (VIH),algunos efectos secundarios causados por los medicamentos contra el VIH son muy comunes y pueden durar solamente unos días o semanas. Por ejemplo, las náuseas, la fatiga y los trastornos del sueño son algunos de esos efectos secundarios a corto plazo,no suspenda el tratamiento por que el viruz puede volverse resistente "
  },
  efavirenz: {
    interacciones: ["alcohol", "fenitoina", "cisaprida"],
    info:
      "Se usa junto con otros medicamentos para tratar la infección por el virus de inmunodeficiencia humana (VIH),algunos efectos secundarios causados por los medicamentos contra el VIH son muy comunes y pueden durar solamente unos días o semanas. Por ejemplo, las náuseas, la fatiga y los trastornos del sueño son algunos de esos efectos secundarios a corto plazo, no suspenda el tratamiento por que el viruz puede volverse resistente "
  },
  clonidina: {
    interacciones: ["diclofenaco", "digoxina", "carvedilol", "atenolol"],
    info:
      "La clonidina trata la presión arterial alta disminuyendo la frecuencia cardíaca y relajando los vasos sanguíneos para que la sangre pueda fluir más fácilmente por el cuerpo, se debe tomar bajo supervisión por su capacidad de generar hipotensión."
  },
  dipirona: {
    interacciones: ["ciclosporina"],
    info:
      "Analgésico, antipirético de segunda línea en casos de dolor o fiebre moderados o severos que no han cedido a otras alternativas farmacológicas. Muy usado en crisis de migraña. No usar por más del tiempo recetado por su médico. En caso de presentar alergias, suspenda inmediatamente."
  },
  ibuprofeno: {
    interacciones: ["aspirina"],
    info:
      "Un antiinflamatorio no esteroideo usado para tratar el dolor y la inflamación. No se recomienda sostener el tratamiento por más de 7 días. Puede generar malestar gástrico."
  },
  metformina: {
    interacciones: ["alcohol"],
    info:
      "Medicamento para tratar la diabetes tipo 2. Dentro de sus reacciones adversas más comunes se encuentra la diarrea, normalmente al inicio del tratamiento. No mezclar con bebidas alcohólicas."
  },
  empagliflozina: {
    interacciones: ["alcohol", "insulina"],
    info:
      "empagliflozina se usa junto con dieta y ejercicio, y a veces con otros medicamentos, para reducir los niveles de azúcar en la sangre en adultos y niños a partir de 10 años con diabetes tipo 2."
  },
  insulina: {
    interacciones: ["alcohol", "insulina"],
    info:
      "La insulina es una hormona liberada por el páncreas como respuesta a la presencia de glucosa en la sangre, se usa en casos avanzados de diabetes, siempre se debe aplicar segun la dosis prescrita por el medico, asi como en los momentos de urgencia, revisar glucometrias antes de la aplicación, en casos de sudoracion, mareos, dirigirse al centro d salud mas cercano."
  },
  amoxicilina: {
    interacciones: ["alopurinol"],
    info:
      "Antibiótico para infecciones bacterianas. Los antibióticos deben ser prescritos bajo fórmula médica. No se recomienda la automedicación debido a la resistencia a patógenos después de su uso."
  },
  losartan: {
    interacciones: ["litio"],
    info: "Usado para tratar la hipertensión."
  },
  omeprazol: {
    interacciones: ["clopidogrel"],
    info:
      "Reduce la cantidad de ácido producido en el estómago. No produce una capa protectora. En caso de estar tomando vitaminas, puede reducir su absorción. Su uso por más de 2 años debe ser reevaluado por un profesional sanitario."
  },
  esomeprazol: {
    interacciones: ["escitalopram"],
    info:
      "Reduce la cantidad de ácido producido en el estómago. No produce una capa protectora. En caso de estar tomando vitaminas, puede reducir su absorción. Su uso por más de 2 años debe ser reevaluado por un profesional sanitario."
  },
  simvastatina: {
    interacciones: ["gemfibrozilo"],
    info: "Usada para reducir el colesterol y los triglicéridos."
  },
  rifampicina: {
    interacciones: ["atazanavir", "ritonavir", "alcohol"],
    info:
      "La rifampicina se usa en combinación con otros medicamentos para tratar la tuberculosis, no se recomienda suspender por el riesgo de resistencia del microorganismo"
  },
  isoniazida: {
    interacciones: ["atazanavir", "ritonavir", "alcohol"],
    info:
      "Se usa en combinación con otros medicamentos para tratar la tuberculosis, no se recomienda suspender por el riesgo de resistencia del microorganismo"
  },
  pirazinamida: {
    interacciones: ["atazanavir", "ritonavir", "alcohol"],
    info:
      "Se usa en combinación con otros medicamentos para tratar la tuberculosis, no se recomienda suspender por el riesgo de resistencia del microorganismo"
  },
  etambutol: {
    interacciones: ["atazanavir", "ritonavir", "alcohol", "gaviscon"],
    info:
      "Se usa en combinación con otros medicamentos para tratar la tuberculosis, no se recomienda suspender por el riesgo de resistencia del microorganismo"
  },
  bisacodilo: {
    interacciones: ["contumax"],
    info:
      "Se usa a corto plazo para tratar el estreñimiento. También se usa para evacuar el intestino antes de una cirugía o determinados procedimientos médicos. No se recomienda su uso con otros laxantes debido al riesgo de daño de la mucosa intestinal. En caso de presentar malestar estomacal o sangrado, suspenda el medicamento e informe a su médico."
  },
  alopurinol: {
    interacciones: ["azatioprina"],
    info: "Ayuda a reducir los niveles de ácido úrico en la sangre."
  },
  eritromicina: {
    interacciones: ["warfarina", "teofilina", "ciclosporina"],
    info:
      "La eritromicina se usa para tratar ciertas infecciones causadas por bacterias, como por ejemplo, infecciones del tracto respiratorio, incluyendo bronquitis, siempre debe ser prescrito por un profesional medico."
  },
  warfarina: {
    interacciones: ["aspirina", "apixaban", "rivaroxaban"],
    info:
      "Anticoagulante usado para prevenir coágulos sanguíneos. Se recomienda evitar el uso de bebidas verdes, ya que reducen el efecto del medicamento. Si usa suplementos o vitaminas, informe a su médico."
  },
  atorvastatina: {
    interacciones: ["gemfibrozilo", "eritromicina"],
    info:
      "Reduce el colesterol y ayuda a prevenir enfermedades cardiovasculares. Se debe tener cuidado con este medicamento en personas mayores debido al riesgo de deterioro muscular que puede causar durante tiempos de uso prolongados. Si refiere malestar muscular, consulte a su médico."
  },
  rosuvastatina: {
    interacciones: ["gemfibrozilo", "eritromicina"],
    info:
      "Reduce el colesterol y ayuda a prevenir enfermedades cardiovasculares. Se debe tener cuidado con este medicamento en personas mayores debido al riesgo de deterioro muscular que puede causar durante tiempos de uso prolongados. Si refiere malestar muscular, consulte a su médico."
  },
  lovastatina: {
    interacciones: ["gemfibrozilo", "eritromicina"],
    info:
      "Reduce el colesterol y ayuda a prevenir enfermedades cardiovasculares. Se debe tener cuidado con este medicamento en personas mayores debido al riesgo de deterioro muscular que puede causar durante tiempos de uso prolongados. Si refiere malestar muscular, consulte a su médico."
  },
  tramadol: {
    interacciones: ["alcohol", "benzodiazepinas"],
    info:
      "Analgésico opioide usado para tratar el dolor moderado a severo. Este medicamento puede causar sudoraciones nocturnas, mareo y vómito. En caso de no tolerarlo, se recomienda suspenderlo y consultar a su médico."

    //prueba
  },
  cefalexina: {
    interacciones: ["probenecid", "cefadroxilo"],
    info:
      "Antibiótico utilizado para infecciones bacterianas. No tomar en caso de presentar alergias a las penicilinas. Los antibióticos deben ser prescritos bajo fórmula médica. No se recomienda la automedicación debido a la resistencia a patógenos después de su uso."
  },
  quetiapina: {
    interacciones: ["fluconazol", "eritromicina"],
    info:
      "La quetiapina es un antipsicótico atípico que se usa para tratar el trastorno bipolar y la esquizofrenia, se usa mayormente como sedante para el tratamiento del insomnio"
  },
  amitriptilina: {
    interacciones: ["fluconazol", "eritromicina"],
    info:
      "Medicamento que se usa para tratar la depresión y que se puede indicar para tratar la ansiedad, los trastornos del sueño y el dolor. Asimismo, está en estudio una forma oral o en gel para tratar el dolor en los nervios causado por la quimioterapia"
  },
  olanzapina: {
    interacciones: ["fluconazol", "eritromicina"],
    info:
      "Antipsicótico atípico que se usa para tratar el trastorno bipolar y la esquizofrenia, se usa mayormente como sedante para el tratamiento del insomnio"
  },
  cefadroxilo: {
    interacciones: ["alcohol"],
    info:
      "Antibiótico utilizado para infecciones bacterianas. No tomar en caso de presentar alergias a las penicilinas. Los antibióticos deben ser prescritos bajo fórmula médica. No se recomienda la automedicación debido a la resistencia a patógenos después de su uso."
  },
  trimetropin_sulfametoxazol: {
    interacciones: ["alcohol"],
    info:
      "Antibiótico utilizado para infecciones bacterianas.No consumir alcohol en caso de estar bajo tratamiento. Los antibióticos deben ser prescritos bajo fórmula médica. No se recomienda la automedicación debido a la resistencia a patógenos después de su uso."
  },
  furosemida: {
    interacciones: ["digoxina", "litio"],
    info: "Diurético utilizado para tratar edemas e hipertensión."
  },
  hidroxicina: {
    interacciones: ["alcohol"],
    info:
      "La hidroxicina se usa en adultos y niños para aliviar la picazón causada por las reacciones alérgicas de la piel, se usa tambien para el tratamiento del insomnio, no recomendado en pacientes mayores de 65 años."
  },
  difenhiframina: {
    interacciones: ["alcohol"],
    info:
      "se usa en adultos y niños para aliviar la picazón causada por las reacciones alérgicas de la piel, se usa tambien para el tratamiento del insomnio. , no recomendado en pacientes mayores de 65 años."
  },
  cetrizina: {
    interacciones: ["alcohol"],
    info:
      "se usa en adultos y niños para aliviar la picazón causada por las reacciones alérgicas de la piel, se usa tambien para el tratamiento del insomnio, no recomendado en pacientes mayores de 65 años."
  },
  melatonina: {
    interacciones: ["apixaban", "rivaroxaban", "warfarina"],
    info:
      "La melatonina es una hormona producida por el cuerpo. Regula los ciclos de día y noche o los ciclos de sueño-vigilia. La melatonina en los suplementos generalmente se produce en un laboratorio. La oscuridad hace que el cuerpo produzca más melatonina."
  },
  zopiclona: {
    interacciones: ["codeina", "hidromorfona", "alcohol"],
    info:
      "La melatonina es una hormona producida por el cuerpo. Regula los ciclos de día y noche o los ciclos de sueño-vigilia. La melatonina en los suplementos generalmente se produce en un laboratorio. La oscuridad hace que el cuerpo produzca más melatonina."
  },
  ranitidina: {
    interacciones: ["ketoconazol"],
    info: "Usado para reducir el ácido en el estómago."
  },
  celecoxib: {
    interacciones: ["ketorolaco", "ibuprofeno", "naproxeno", "etoricoxib"],
    info:
      "Analgésico y antiinflamatorio. Se recomienda usarlo solo por máximo 7 días. En caso de presentar molestias estomacales, considerar suspender su uso y consultar con su médico."
  },
  naproxeno: {
    interacciones: ["ketorolaco", "ibuprofeno", "celecoxib", "etoricoxib"],
    info:
      "Analgésico y antiinflamatorio. Se recomienda usarlo solo por máximo 7 días. En caso de presentar molestias estomacales, considerar suspender su uso y consultar con su médico."
  },
  contumax: {
    interacciones: ["bisacodilo", "contumax"],
    info:
      "Tratamiento de la constipación. Puede generar flatulencias y calambres estomacales. No se recomienda tomar con otros laxantes."
  },
  etoricoxib: {
    interacciones: ["ketorolaco", "ibuprofeno", "naproxeno", "celecoxib"],
    info:
      "Analgésico y antiinflamatorio. Se recomienda usarlo solo por máximo 7 días. En caso de presentar molestias estomacales, considerar suspender su uso y consultar con su médico."
  },
  metronidazol: {
    interacciones: ["ketoconazol", "warfarina", "fenitoína"],
    info:
      "El metronidazol se usa para tratar infecciones vaginales como vaginosis bacteriana (una infección ocasionada debido a la gran cantidad de determinada bacteria en la vagina). El metronidazol pertenece a una clase de medicamentos llamados antimicrobianos. Se debe restringir la ingesta de alcohol durante el tratamiento."
  },
  fluconazol: {
    interacciones: ["ketoconazol", "warfarina", "fenitoína"],
    info:
      "El fluconazol se usa para tratar las infecciones por hongos, incluidas las infecciones por levaduras de la vagina, la boca, la garganta, el esófago (el conducto que va desde la boca hasta el estómago), el abdomen (el área entre el pecho y la cintura), los pulmones, la sangre y otros órganos.. Siempre debe ser recetado por un profesional sanitario. Se debe restringir la ingesta de alcohol durante el tratamiento."
  },
  ketoconazol: {
    interacciones: ["alcohol"],
    info:
      "Se utiliza para tratar infecciones causadas por hongos. Está extremadamente restringido su uso si se está consumiendo alcohol. No se recomienda su uso en mujeres embarazadas. Debe ser prescrito por un profesional sanitario."
  },
  prednisona: {
    interacciones: ["ibuprofeno", "aspirina"],
    info:
      "Corticosteroide utilizado para tratar inflamaciones y alergias. Tener cuidado con su uso prolongado y la dosis. Siempre debe ser orientado por un profesional sanitario."
  },
  prednisolona: {
    interacciones: ["ibuprofeno", "aspirina"],
    info:
      "Corticosteroide utilizado para tratar inflamaciones y alergias. Tener cuidado con su uso prolongado y la dosis. Siempre debe ser orientado por un profesional sanitario."
  },
  hidrocortisona: {
    interacciones: ["ibuprofeno", "aspirina"],
    info:
      "Corticosteroide utilizado para tratar inflamaciones y alergias. Tener cuidado con su uso prolongado y la dosis. Siempre debe ser orientado por un profesional sanitario."
  },
  enalapril: {
    interacciones: ["litio", "diuréticos"],
    info:
      "Inhibidor de la ECA usado para tratar la hipertensión. En caso de presentar tos persistente, informe a su médico."
  },
  azitromicina: {
    interacciones: ["warfarina"],
    info:
      "Antibiótico usado para infecciones bacterianas. Los antibióticos deben ser prescritos bajo fórmula médica. No se recomienda la automedicación debido a la resistencia a patógenos después de su uso."
  },
  clopidogrel: {
    interacciones: ["omeprazol"],
    info: "Anticoagulante utilizado para prevenir coágulos sanguíneos."
  },
  diclofenaco: {
    interacciones: ["ibuprofeno", "aspirina"],
    info:
      "Antiinflamatorio usado para tratar el dolor y la inflamación. Dentro de sus reacciones adversas más comunes se encuentra el reflujo gastroesofágico."
  },
  metoprolol: {
    interacciones: ["quinidina", "digoxina", "clonidina"],
    info:
      "El metoprolol se usa solo o en combinación con otros medicamentos para tratar la presión arterial alta. También se usa para tratar la angina (dolor de pecho) crónica (a largo plazo). El metoprolol también se usa para mejorar la supervivencia después de sufrir un ataque cardíaco."
  },
  nifedipino: {
    interacciones: ["rifampicina"],
    info:
      "Pertenece a una clase de medicamentos denominados bloqueantes de los canales del calcio. Reduce la presión arterial al relajar los vasos sanguíneos, de modo que el corazón no tiene que bombear con tanta fuerza"
  },
  propanolol: {
    interacciones: ["nifedipino", "diltiazem"],
    info:
      "El propranolol se usa solo o en combinación con otros medicamentos para tratar la presión arterial alta. También se usa para tratar el ritmo cardíaco, en algunos casos se usa para el manejo de la ansiedad."
  },
  carvedilol: {
    interacciones: ["nifedipino", "diltiazem"],
    info:
      "El propranolol se usa solo o en combinación con otros medicamentos para tratar la presión arterial alta. También se usa para tratar el ritmo cardíaco, en algunos casos se usa para el manejo de la ansiedad."
  },
  amlodipino: {
    interacciones: ["claritromicina", "rifampicina"],
    info:
      "Antihipertensivo, antianginoso y coadyuvante en pacientes con enfermedad arterial coronaria."
  },
  levotiroxina: {
    interacciones: ["milanta", "hidroxido de aluminio", "gaviscon"],
    info:
      "Se utiliza para tratar el hipotiroidismo, una condición en la que la glándula tiroidea no produce suficiente hormona tiroidea. Se puede tomar por vía oral o intravenosa, se debe tomar en ayunas, no tomar leche con este medicamento, No tomar productos con hierro, antiácidos que contengan aluminio y magnesio."
  },
  metimazol: {
    interacciones: ["claritromicina"],
    info:
      "Se utilizan para tratar el hipertiroidismo, ya que reducen la producción de hormonas tiroideas por la glándula."
  },
  gaviscon: {
    interacciones: ["levotiroxina", "tetraciclina"],
    info:
      "Gaviscon es un medicamento que se usa para tratar la acidez estomacal, el reflujo ácido y la indigestión. Su función es neutralizar el ácido del estómago y crear una barrera protectora que evita que el ácido suba al esófago, no tomar antihistaminicos hasta dos horas despues de haberlo tomado."
  },
  enoxaparina: {
    interacciones: ["ibuprofeno", "diclofenaco", "enoxaparina", "warfarina"],
    info:
      "Anticoagulante usado para evitar formación de trombosis, . Tener cuidado con la dosis recetada por el médico tratante. No repetir dosis en caso de olvido. Parar el tratamiento en caso de aparición de morados o sangrado."
  },
  dalteparina: {
    interacciones: [
      "ibuprofeno",
      "diclofenaco",
      "heparina",
      "enoxaparina",
      "warfarina"
    ],
    info:
      "Anticoagulante usado para evitar formación de trombosis. Tener cuidado con la dosis recetada por el médico tratante. No repetir dosis en caso de olvido. Parar el tratamiento en caso de aparición de morados o sangrado."
  },
  tecneplasa: {
    interacciones: ["acido_tranexamico"],
    info:
      "Enzima activadora tisular del plasminógeno que actúa como fibrinolítico; se usa para la disolución de coágulos sanguíneos, como los que se forman en el INFARTO DE MIOCARDIO agudo."
  },
  heparina: {
    interacciones: [
      "ibuprofeno",
      "diclofenaco",
      "heparina",
      "enoxaparina",
      "warfarina"
    ],
    info:
      "Anticoagulante usado para evitar formación de trombosis. Tener cuidado con la dosis recetada por el médico tratante. No repetir dosis en caso de olvido. Parar el tratamiento en caso de aparición de morados o sangrado."
  },
  acido_tranexamico: {
    interacciones: ["tenecteplasa"],
    info:
      "Indicado en el tratamiento y la profilaxis de hemorragias por cirugías o enfermedades autoinmunes. Evitar la automedicación con este medicamento. Debe ser recetado por un profesional sanitario."
  },
  verapamilo: {
    interacciones: ["cimetidina", "hierba de san juan"],
    info:
      "El verapamilo se usa para tratar la presión arterial alta y controlar la angina (dolor en el pecho). Las tabletas de liberación inmediata también se usan solas o con otros medicamentos para prevenir y tratar los latidos cardíacos irregulares, puede interactuar con medicamentos a base de plantas."
  },
  apixaban: {
    interacciones: ["warfarina", "rivaroxaban"],
    info:
      "anticoagulante oral que se utiliza para ayudar a prevenir accidentes cerebrovasculares o coágulos sanguíneos en personas con fibrilación auricular, este debe ser recetado por un profesional sanitario, tener cuidado en caso de sangrado rectal, bucal, o aparición de moretones en el cuerpo."
  },
  rivaroxaban: {
    interacciones: ["warfarina", "apixaban"],
    info:
      "anticoagulante oral que se utiliza para ayudar a prevenir accidentes cerebrovasculares o coágulos sanguíneos en personas con fibrilación auricular, este debe ser recetado por un profesional sanitario, tener cuidado en caso de sangrado rectal, bucal, o aparición de moretones en el cuerpo."
  },
  clotrimazol: {
    interacciones: ["fluconazol"],
    info:
      "El clotrimazol pertenece a una clase de medicamentos antimicóticos llamados imidazoles. Su acción consiste en detener el crecimiento de los hongos que causan las infecciones, la aplicación del medicamento debe basarse segun la formula medica."
  }
};

// Información inicial sobre medicamentos
const initialInfo = `
Para saber si tienes medicamentos que interaccionen entre si puedes digitarlos juntos en el chat, como por ejemplo *digoxina atorvastatina * presiona *enviar* y despues digita *interacciones* y sabras si existen interacciones entre los medicamentos, pueden ser mas de dos.
`;

// Evento de enviar// Saludo inicial
appendMessage(initialInfo, "bot");
appendMessage(
  "¡Hola! Soy tu asistente virtual de salud. 😊 Por favor, dime los nombres de los medicamentos que estás tomando o sobre los que tienes dudas. Si deseas ver el listado de medicamentos digita *mostrar* y aparecera el listado actual de medicamentos, si deseas reiniciar el chat digita *reiniciar*, digita el nombre del medicamento del que tengas dudas y presiona el boton *enviar*",
  "bot"
);
sendButton.addEventListener("click", async () => {
  const userMessage = inputField.value.trim().toLowerCase();
  if (!userMessage) return;

  appendMessage(userMessage, "user"); // Mostrar mensaje del usuario

  // Verificar comandos especiales
  if (userMessage === "reiniciar") {
    resetConversation();
    return;
  }
  if (userMessage === "mostrar") {
    showAvailableDrugs();
    return;
  }

  const botResponse = await getBotResponse(userMessage);
  appendMessage(botResponse, "bot"); // Mostrar respuesta del bot
  inputField.value = ""; // Limpiar campo
});

// Evento de reinicio
resetButton.addEventListener("click", resetConversation);

// Evento para mostrar medicamentos
showDrugsButton.addEventListener("click", showAvailableDrugs);

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
    greetings.some((greet) => userInput.includes(greet))
  ) {
    return "¡Hola de nuevo! Por favor, dime los medicamentos que tomas para ayudarte mejor.";
  }

  // Flujo para solicitar medicamentos
  if (conversationStep === 1) {
    const drugs = userInput
      .split(/[,.\s]+/)
      .map((drug) => drug.trim())
      .filter((drug) => drug);

    if (drugs.length === 0) {
      return "Por favor, ingresa al menos un medicamento.";
    }

    userDrugs = drugs;
    conversationStep = 2;
    return `Gracias. Mencionaste: ${drugs.join(
      ", "
    )}. ¿Quieres buscar interacciones o información general? Si deseas información, digita \"información\"; si quieres saber si dichos medicamentos tienen interacciones importantes, escribe \"interacciones\". `;
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

  return responses.length > 0
    ? responses.join("\n")
    : "No encontré interacciones conocidas entre los medicamentos mencionados.";
}

// Función para obtener información general sobre medicamentos
function getDrugInformation(drugs) {
  const infoResponses = [];

  drugs.forEach((drug) => {
    const data = mockDatabase[drug];
    if (data && data.info) {
      infoResponses.push(`${drug}: ${data.info}`);
    }
  });

  return infoResponses.length > 0
    ? infoResponses.join("\n")
    : "No tengo información sobre los medicamentos mencionados.";
}

// Función para reiniciar la conversación
function resetConversation() {
  conversationStep = 1;
  userDrugs = [];
  chatOutput.innerHTML = ""; // Limpiar el chat
  appendMessage(initialInfo, "bot");
  appendMessage(
    "¡Hola! Soy tu asistente virtual de salud. 😊 Por favor, dime los nombres de los medicamentos que estás tomando o sobre los que tienes dudas.",
    "bot"
  );
}

// Función para mostrar la lista de medicamentos disponibles
function showAvailableDrugs() {
  const drugsList = Object.keys(mockDatabase);
  const message = `Lista de medicamentos disponibles en la base de datos:\n- ${drugsList.join(
    "\n- "
  )}`;
  appendMessage(message, "bot");
}
