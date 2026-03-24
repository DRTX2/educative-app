import { LessonEntity } from '@core/entities/lesson.entity';

export const starterLessons: LessonEntity[] = [
  new LessonEntity({
    id: 1,
    title: 'Matemáticas - Áreas de Cultivo',
    description: 'Aprende a calcular áreas de terrenos para planificar la siembra.',
    category: 'matematicas',
    difficulty: 'basica',
    estimatedMinutes: 12,
    published: true,
    content: {
      introduction:
        'Cuando una familia conoce el tamaño de su terreno, puede organizar mejor semillas, agua y cosecha.',
      questions: [
        {
          id: 1,
          question: 'Si un terreno mide 15 m de largo y 10 m de ancho, ¿cuál es su área?',
          options: [
            { id: 'A', text: '25 m²' },
            { id: 'B', text: '150 m²' },
            { id: 'C', text: '50 m²' },
            { id: 'D', text: '125 m²' },
          ],
          correctAnswer: 'B',
          explanation: 'El área de un rectángulo se calcula multiplicando largo por ancho.',
          hint: 'Multiplica 15 × 10.',
        },
        {
          id: 2,
          question: 'Si un terreno cuadrado mide 20 m por lado, ¿cuál es su área?',
          options: [
            { id: 'A', text: '40 m²' },
            { id: 'B', text: '200 m²' },
            { id: 'C', text: '400 m²' },
            { id: 'D', text: '800 m²' },
          ],
          correctAnswer: 'C',
          explanation: 'El área del cuadrado es lado × lado.',
          hint: 'Haz 20 × 20.',
        },
        {
          id: 3,
          question: 'Dos parcelas miden 30 × 12 y 20 × 18. ¿Cuál es mayor?',
          options: [
            { id: 'A', text: 'La primera' },
            { id: 'B', text: 'La segunda' },
            { id: 'C', text: 'Son iguales' },
            { id: 'D', text: 'No se puede saber' },
          ],
          correctAnswer: 'C',
          explanation: 'Ambas dan 360 m², por eso son iguales.',
          hint: 'Calcula las dos áreas.',
        },
      ],
    },
  }),
  new LessonEntity({
    id: 2,
    title: 'Matemáticas - Regla de Tres Rural',
    description: 'Resuelve proporciones aplicadas a semillas, agua y trabajo.',
    category: 'matematicas',
    difficulty: 'media',
    estimatedMinutes: 14,
    published: true,
    content: {
      introduction:
        'La regla de tres ayuda a estimar cantidades cuando cambian las condiciones del trabajo en el campo.',
      questions: [
        {
          id: 1,
          question: 'Si 3 sacos de semilla alcanzan para 12 hectáreas, ¿cuántos se necesitan para 20?',
          options: [
            { id: 'A', text: '4 sacos' },
            { id: 'B', text: '5 sacos' },
            { id: 'C', text: '6 sacos' },
            { id: 'D', text: '7 sacos' },
          ],
          correctAnswer: 'B',
          explanation: 'Multiplica 3 × 20 y divide para 12.',
          hint: 'Es una proporción directa.',
        },
        {
          id: 2,
          question: 'Si 200 litros riegan 50 plantas, ¿cuántos litros se necesitan para 125?',
          options: [
            { id: 'A', text: '300 litros' },
            { id: 'B', text: '400 litros' },
            { id: 'C', text: '500 litros' },
            { id: 'D', text: '600 litros' },
          ],
          correctAnswer: 'C',
          explanation: '200 × 125 / 50 = 500.',
          hint: 'Primero divide para saber cuántos litros por planta.',
        },
        {
          id: 3,
          question: 'Si 5 trabajadores hacen una labor en 8 días, ¿cuántos días tomaría con 10?',
          options: [
            { id: 'A', text: '2 días' },
            { id: 'B', text: '4 días' },
            { id: 'C', text: '6 días' },
            { id: 'D', text: '16 días' },
          ],
          correctAnswer: 'B',
          explanation: 'Al duplicar trabajadores, el tiempo se reduce a la mitad.',
          hint: 'Piensa en una relación inversa.',
        },
      ],
    },
  }),
  new LessonEntity({
    id: 3,
    title: 'Ciencias - Ciclo del Agua',
    description: 'Comprende por qué el agua sostiene la vida y la agricultura.',
    category: 'ciencias',
    difficulty: 'basica',
    estimatedMinutes: 10,
    published: true,
    content: {
      introduction:
        'El agua se mueve en un ciclo continuo. Entenderlo ayuda a cuidar cultivos, pozos y suelos.',
      questions: [
        {
          id: 1,
          question: '¿Qué pasa cuando el sol calienta el agua de ríos y lagos?',
          options: [
            { id: 'A', text: 'Se congela' },
            { id: 'B', text: 'Se evapora' },
            { id: 'C', text: 'Desaparece' },
            { id: 'D', text: 'Se endurece' },
          ],
          correctAnswer: 'B',
          explanation: 'El calor transforma parte del agua en vapor.',
          hint: 'Piensa en el vapor que sale al hervir agua.',
        },
        {
          id: 2,
          question: '¿Cómo se llama el agua que cae de las nubes?',
          options: [
            { id: 'A', text: 'Evaporación' },
            { id: 'B', text: 'Condensación' },
            { id: 'C', text: 'Precipitación' },
            { id: 'D', text: 'Infiltración' },
          ],
          correctAnswer: 'C',
          explanation: 'Lluvia, nieve o granizo forman parte de la precipitación.',
          hint: 'Es la fase en que el agua baja del cielo.',
        },
        {
          id: 3,
          question: '¿Por qué el ciclo del agua es importante para los cultivos?',
          options: [
            { id: 'A', text: 'Porque lava las hojas' },
            { id: 'B', text: 'Porque trae lluvia y recarga fuentes de agua' },
            { id: 'C', text: 'Porque crea viento' },
            { id: 'D', text: 'Porque cambia la tierra de color' },
          ],
          correctAnswer: 'B',
          explanation: 'Sin este ciclo, no tendríamos lluvias ni recarga de ríos o pozos.',
          hint: 'Piensa en de dónde viene el agua que riega la tierra.',
        },
      ],
    },
  }),
];
