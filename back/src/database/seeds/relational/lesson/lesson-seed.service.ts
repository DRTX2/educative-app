import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonEntity } from '../../../../lessons/infrastructure/persistence/relational/entities/lesson.entity';

@Injectable()
export class LessonSeedService {
  constructor(
    @InjectRepository(LessonEntity)
    private repository: Repository<LessonEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      const lessons = [
        {
          title: 'Matemáticas - Áreas de Cultivo',
          description:
            'Aprende a calcular áreas de terrenos rectangulares y cuadrados para planificar tu siembra',
          category: 'matematicas',
          difficulty: 'basica',
          content: {
            introduction:
              'Cuando trabajamos en el campo, es importante saber cuántos metros cuadrados tiene nuestro terreno para saber cuánta semilla necesitamos y cuánto podemos cosechar.',
            questions: [
              {
                id: 1,
                question:
                  'Don Juan tiene un terreno rectangular de 15 metros de largo y 10 metros de ancho. ¿Cuántos metros cuadrados tiene?',
                options: [
                  { id: 'A', text: '25 m²' },
                  { id: 'B', text: '150 m²' },
                  { id: 'C', text: '50 m²' },
                  { id: 'D', text: '125 m²' },
                ],
                correctAnswer: 'B',
                explanation:
                  'Para calcular el área de un rectángulo multiplicamos largo × ancho: 15 × 10 = 150 m²',
              },
              {
                id: 2,
                question:
                  'Si un terreno cuadrado tiene 20 metros por cada lado, ¿cuál es su área?',
                options: [
                  { id: 'A', text: '40 m²' },
                  { id: 'B', text: '80 m²' },
                  { id: 'C', text: '400 m²' },
                  { id: 'D', text: '200 m²' },
                ],
                correctAnswer: 'C',
                explanation:
                  'El área de un cuadrado es lado × lado: 20 × 20 = 400 m²',
              },
              {
                id: 3,
                question:
                  'Un terreno tiene 25m de largo y 8m de ancho. ¿Cuántos metros cuadrados tiene?',
                options: [
                  { id: 'A', text: '33 m²' },
                  { id: 'B', text: '200 m²' },
                  { id: 'C', text: '100 m²' },
                  { id: 'D', text: '250 m²' },
                ],
                correctAnswer: 'B',
                explanation: 'Área = largo × ancho = 25 × 8 = 200 m²',
              },
              {
                id: 4,
                question:
                  'Si un terreno cuadrado tiene un área de 144 m², ¿cuánto mide cada lado?',
                options: [
                  { id: 'A', text: '10 metros' },
                  { id: 'B', text: '12 metros' },
                  { id: 'C', text: '14 metros' },
                  { id: 'D', text: '16 metros' },
                ],
                correctAnswer: 'B',
                explanation:
                  'Para encontrar el lado de un cuadrado cuando conocemos el área, sacamos la raíz cuadrada: √144 = 12 metros',
              },
              {
                id: 5,
                question:
                  'Una parcela rectangular de 30m × 12m y otra de 20m × 18m. ¿Cuál tiene mayor área?',
                options: [
                  { id: 'A', text: 'La primera (30m × 12m)' },
                  { id: 'B', text: 'La segunda (20m × 18m)' },
                  { id: 'C', text: 'Ambas tienen la misma área' },
                  { id: 'D', text: 'No se puede calcular' },
                ],
                correctAnswer: 'C',
                explanation:
                  'Primera: 30 × 12 = 360 m². Segunda: 20 × 18 = 360 m². ¡Ambas tienen 360 m²!',
              },
            ],
          },
        },
        {
          title: 'Matemáticas - Regla de Tres Simple',
          description:
            'Aprende a resolver problemas de proporciones aplicados a la agricultura',
          category: 'matematicas',
          difficulty: 'media',
          content: {
            introduction:
              'La regla de tres nos ayuda a resolver problemas cuando necesitamos calcular cantidades proporcionales. Es muy útil para calcular semillas, fertilizantes y cosechas.',
            questions: [
              {
                id: 1,
                question:
                  'Si 3 sacos de semilla cubren 12 hectáreas, ¿cuántos sacos necesito para 20 hectáreas?',
                options: [
                  { id: 'A', text: '4 sacos' },
                  { id: 'B', text: '5 sacos' },
                  { id: 'C', text: '6 sacos' },
                  { id: 'D', text: '7 sacos' },
                ],
                correctAnswer: 'B',
                explanation:
                  'Si 3 sacos → 12 ha, entonces X sacos → 20 ha. (3 × 20) ÷ 12 = 5 sacos',
              },
              {
                id: 2,
                question:
                  'Si 5 trabajadores cosechan un campo en 8 días, ¿cuántos días tardarán 10 trabajadores?',
                options: [
                  { id: 'A', text: '2 días' },
                  { id: 'B', text: '4 días' },
                  { id: 'C', text: '6 días' },
                  { id: 'D', text: '16 días' },
                ],
                correctAnswer: 'B',
                explanation:
                  'Si 5 trabajadores → 8 días, entonces 10 trabajadores → X días. (5 × 8) ÷ 10 = 4 días',
              },
              {
                id: 3,
                question:
                  'Un tanque de 200 litros de agua riega 50 plantas. ¿Cuántos litros necesito para regar 125 plantas?',
                options: [
                  { id: 'A', text: '400 litros' },
                  { id: 'B', text: '450 litros' },
                  { id: 'C', text: '500 litros' },
                  { id: 'D', text: '550 litros' },
                ],
                correctAnswer: 'C',
                explanation:
                  'Si 200 L → 50 plantas, entonces X litros → 125 plantas. (200 × 125) ÷ 50 = 500 litros',
              },
              {
                id: 4,
                question:
                  'Si 2 kg de fertilizante cuestan $45, ¿cuánto costarán 7 kg?',
                options: [
                  { id: 'A', text: '$147' },
                  { id: 'B', text: '$157.50' },
                  { id: 'C', text: '$162' },
                  { id: 'D', text: '$315' },
                ],
                correctAnswer: 'B',
                explanation:
                  'Si 2 kg → $45, entonces 7 kg → X pesos. (45 × 7) ÷ 2 = $157.50',
              },
              {
                id: 5,
                question:
                  'Una bomba de agua llena un estanque en 3 horas. ¿Cuánto tiempo tardarán 2 bombas iguales?',
                options: [
                  { id: 'A', text: '1 hora' },
                  { id: 'B', text: '1.5 horas' },
                  { id: 'C', text: '2 horas' },
                  { id: 'D', text: '6 horas' },
                ],
                correctAnswer: 'B',
                explanation:
                  'Si 1 bomba → 3 horas, entonces 2 bombas → X horas. (1 × 3) ÷ 2 = 1.5 horas',
              },
            ],
          },
        },
        {
          title: 'Ciencias Naturales - Ciclo del Agua',
          description:
            'Comprende el ciclo del agua y su importancia para la agricultura',
          category: 'ciencias',
          difficulty: 'basica',
          content: {
            introduction:
              'El agua es esencial para nuestros cultivos. El ciclo del agua explica cómo el agua se mueve en la naturaleza: se evapora, forma nubes, cae como lluvia y vuelve a empezar.',
            questions: [
              {
                id: 1,
                question:
                  '¿Qué sucede cuando el sol calienta el agua de los ríos y lagos?',
                options: [
                  { id: 'A', text: 'Se congela' },
                  { id: 'B', text: 'Se evapora y sube al cielo' },
                  { id: 'C', text: 'Se hunde en la tierra' },
                  { id: 'D', text: 'Desaparece para siempre' },
                ],
                correctAnswer: 'B',
                explanation:
                  'El calor del sol evapora el agua, convirtiéndola en vapor que sube a la atmósfera',
              },
              {
                id: 2,
                question: '¿Qué son las nubes?',
                options: [
                  { id: 'A', text: 'Humo de las fábricas' },
                  { id: 'B', text: 'Vapor de agua condensado' },
                  { id: 'C', text: 'Algodón en el cielo' },
                  { id: 'D', text: 'Polvo atmosférico' },
                ],
                correctAnswer: 'B',
                explanation:
                  'Las nubes están formadas por pequeñas gotas de agua que se condensan del vapor',
              },
              {
                id: 3,
                question:
                  '¿Qué nombre recibe el agua que cae de las nubes en forma de gotas?',
                options: [
                  { id: 'A', text: 'Evaporación' },
                  { id: 'B', text: 'Condensación' },
                  { id: 'C', text: 'Precipitación' },
                  { id: 'D', text: 'Infiltración' },
                ],
                correctAnswer: 'C',
                explanation:
                  'La precipitación es cuando el agua cae de las nubes en forma de lluvia, nieve o granizo',
              },
              {
                id: 4,
                question:
                  '¿Por qué es importante el ciclo del agua para los cultivos?',
                options: [
                  { id: 'A', text: 'No es importante' },
                  {
                    id: 'B',
                    text: 'Porque la lluvia riega los cultivos naturalmente',
                  },
                  { id: 'C', text: 'Solo para lavar las plantas' },
                  { id: 'D', text: 'Para crear charcos' },
                ],
                correctAnswer: 'B',
                explanation:
                  'El ciclo del agua trae lluvia que riega naturalmente nuestros cultivos y recarga ríos y pozos',
              },
              {
                id: 5,
                question:
                  '¿Qué pasa con el agua de lluvia que cae en la tierra?',
                options: [
                  { id: 'A', text: 'Solo se evapora' },
                  {
                    id: 'B',
                    text: 'Parte se infiltra en el suelo y parte escurre a los ríos',
                  },
                  { id: 'C', text: 'Se convierte en tierra' },
                  { id: 'D', text: 'Se queda quieta para siempre' },
                ],
                correctAnswer: 'B',
                explanation:
                  'El agua de lluvia se infiltra en el suelo (alimentando plantas y pozos) o escurre hasta ríos y lagos',
              },
            ],
          },
        },
        {
          title: 'Ciencias Naturales - Ciclos de Siembra',
          description:
            'Aprende sobre las mejores épocas para sembrar diferentes cultivos',
          category: 'ciencias',
          difficulty: 'media',
          content: {
            introduction:
              'Cada cultivo tiene su época ideal para sembrarse. Conocer estos ciclos nos ayuda a tener mejores cosechas y aprovechar mejor el clima y el agua.',
            questions: [
              {
                id: 1,
                question:
                  '¿En qué época es mejor sembrar maíz en clima templado?',
                options: [
                  { id: 'A', text: 'En invierno cuando hace frío' },
                  { id: 'B', text: 'En primavera cuando empieza el calor' },
                  { id: 'C', text: 'En otoño cuando caen las hojas' },
                  { id: 'D', text: 'No importa la época' },
                ],
                correctAnswer: 'B',
                explanation:
                  'El maíz se siembra en primavera para que crezca con calor y tenga suficiente tiempo antes del frío',
              },
              {
                id: 2,
                question: '¿Por qué algunos cultivos se siembran antes de las lluvias?',
                options: [
                  { id: 'A', text: 'Para que la semilla no se moje' },
                  {
                    id: 'B',
                    text: 'Para que la lluvia ayude a germinar y crecer',
                  },
                  { id: 'C', text: 'Es solo una tradición' },
                  { id: 'D', text: 'Para que la semilla se seque' },
                ],
                correctAnswer: 'B',
                explanation:
                  'Sembrar antes de las lluvias asegura que las semillas tengan agua para germinar y las plantas puedan crecer bien',
              },
              {
                id: 3,
                question:
                  '¿Qué cultivo típicamente se siembra en otoño en clima templado?',
                options: [
                  { id: 'A', text: 'Trigo' },
                  { id: 'B', text: 'Sandía' },
                  { id: 'C', text: 'Tomate' },
                  { id: 'D', text: 'Calabaza' },
                ],
                correctAnswer: 'A',
                explanation:
                  'El trigo de invierno se siembra en otoño, crece lentamente en invierno y se cosecha en verano',
              },
              {
                id: 4,
                question:
                  '¿Qué debemos considerar al elegir la fecha de siembra?',
                options: [
                  { id: 'A', text: 'Solo el día de la semana' },
                  { id: 'B', text: 'El clima, las lluvias y el tipo de cultivo' },
                  { id: 'C', text: 'Solo la fase de la luna' },
                  { id: 'D', text: 'No hay que considerar nada' },
                ],
                correctAnswer: 'B',
                explanation:
                  'Es importante considerar el clima esperado, la temporada de lluvias y las necesidades específicas de cada cultivo',
              },
              {
                id: 5,
                question:
                  'Si siembro muy tarde en la temporada, ¿qué puede pasar?',
                options: [
                  { id: 'A', text: 'El cultivo crece más rápido' },
                  {
                    id: 'B',
                    text: 'El cultivo puede no madurar antes del frío o la sequía',
                  },
                  { id: 'C', text: 'No pasa nada diferente' },
                  { id: 'D', text: 'Se cosecha el doble' },
                ],
                correctAnswer: 'B',
                explanation:
                  'Si sembramos tarde, el cultivo puede no tener tiempo suficiente para crecer antes de que llegue el frío o la sequía',
              },
            ],
          },
        },
        {
          title: 'Comprensión Lectora - La Milpa',
          description:
            'Lee sobre una tradición agrícola y responde preguntas de comprensión',
          category: 'lengua',
          difficulty: 'basica',
          content: {
            text: 'La milpa es una forma tradicional de cultivo que practican muchas comunidades. En la milpa se siembran juntos el maíz, el frijol y la calabaza. Estos tres cultivos se ayudan entre sí: el maíz crece alto y sirve de soporte para el frijol, el frijol aporta nutrientes a la tierra, y la calabaza cubre el suelo con sus hojas grandes evitando que crezcan hierbas malas y que se seque la tierra. Esta forma de cultivar es muy inteligente porque aprovecha mejor el espacio y mantiene la tierra fértil sin necesitar tantos químicos. Además, estos tres alimentos son la base de una dieta nutritiva.',
            questions: [
              {
                id: 1,
                question: '¿Qué tres cultivos se siembran juntos en la milpa?',
                options: [
                  { id: 'A', text: 'Maíz, trigo y arroz' },
                  { id: 'B', text: 'Maíz, frijol y calabaza' },
                  { id: 'C', text: 'Papa, tomate y cebolla' },
                  { id: 'D', text: 'Frijol, lenteja y garbanzo' },
                ],
                correctAnswer: 'B',
                explanation: 'En la milpa se siembran maíz, frijol y calabaza',
              },
              {
                id: 2,
                question: '¿Para qué le sirve el maíz al frijol?',
                options: [
                  { id: 'A', text: 'Le da sombra' },
                  { id: 'B', text: 'Le sirve de soporte para trepar' },
                  { id: 'C', text: 'Le da agua' },
                  { id: 'D', text: 'No se ayudan' },
                ],
                correctAnswer: 'B',
                explanation:
                  'El maíz crece alto y fuerte, sirviendo de soporte para que el frijol trepe',
              },
              {
                id: 3,
                question: '¿Qué beneficio aporta el frijol a la tierra?',
                options: [
                  { id: 'A', text: 'La seca' },
                  { id: 'B', text: 'La compacta' },
                  { id: 'C', text: 'Aporta nutrientes' },
                  { id: 'D', text: 'La enfría' },
                ],
                correctAnswer: 'C',
                explanation:
                  'El frijol aporta nutrientes a la tierra, especialmente nitrógeno',
              },
              {
                id: 4,
                question: '¿Cómo ayuda la calabaza en la milpa?',
                options: [
                  { id: 'A', text: 'Crece muy alto' },
                  {
                    id: 'B',
                    text: 'Sus hojas cubren el suelo y evitan hierbas malas',
                  },
                  { id: 'C', text: 'Produce más maíz' },
                  { id: 'D', text: 'Atrae insectos' },
                ],
                correctAnswer: 'B',
                explanation:
                  'Las hojas grandes de la calabaza cubren el suelo, evitando hierbas malas y manteniendo la humedad',
              },
              {
                id: 5,
                question: '¿Por qué la milpa es una forma inteligente de cultivar?',
                options: [
                  { id: 'A', text: 'Porque es más rápida' },
                  {
                    id: 'B',
                    text: 'Porque los cultivos se ayudan y mantienen la tierra fértil',
                  },
                  { id: 'C', text: 'Porque no necesita agua' },
                  { id: 'D', text: 'Porque es moderna' },
                ],
                correctAnswer: 'B',
                explanation:
                  'La milpa es inteligente porque aprovecha que los cultivos se ayudan mutuamente y mantiene la tierra fértil naturalmente',
              },
            ],
          },
        },
        {
          title: 'Matemáticas - Medidas y Conversiones',
          description:
            'Aprende a convertir diferentes unidades de medida útiles en la agricultura',
          category: 'matematicas',
          difficulty: 'media',
          content: {
            introduction:
              'En el campo usamos diferentes medidas: metros, litros, kilogramos, hectáreas. Es importante saber convertir entre ellas para comprar lo justo y vender bien.',
            questions: [
              {
                id: 1,
                question: '¿Cuántos metros tiene 1 kilómetro?',
                options: [
                  { id: 'A', text: '10 metros' },
                  { id: 'B', text: '100 metros' },
                  { id: 'C', text: '1,000 metros' },
                  { id: 'D', text: '10,000 metros' },
                ],
                correctAnswer: 'C',
                explanation: '1 kilómetro = 1,000 metros',
              },
              {
                id: 2,
                question:
                  'Si compro media tonelada de fertilizante, ¿cuántos kilogramos son?',
                options: [
                  { id: 'A', text: '50 kg' },
                  { id: 'B', text: '100 kg' },
                  { id: 'C', text: '500 kg' },
                  { id: 'D', text: '5,000 kg' },
                ],
                correctAnswer: 'C',
                explanation: '1 tonelada = 1,000 kg, entonces media tonelada = 500 kg',
              },
              {
                id: 3,
                question: '¿Cuántos litros hay en 5 garrafones de 20 litros cada uno?',
                options: [
                  { id: 'A', text: '25 litros' },
                  { id: 'B', text: '50 litros' },
                  { id: 'C', text: '80 litros' },
                  { id: 'D', text: '100 litros' },
                ],
                correctAnswer: 'D',
                explanation: '5 garrafones × 20 litros = 100 litros',
              },
              {
                id: 4,
                question:
                  'Una hectárea equivale a 10,000 m². Si tengo un terreno de 5,000 m², ¿cuántas hectáreas son?',
                options: [
                  { id: 'A', text: '0.5 hectáreas' },
                  { id: 'B', text: '2 hectáreas' },
                  { id: 'C', text: '5 hectáreas' },
                  { id: 'D', text: '50 hectáreas' },
                ],
                correctAnswer: 'A',
                explanation:
                  '5,000 m² ÷ 10,000 = 0.5 hectáreas (media hectárea)',
              },
              {
                id: 5,
                question:
                  'Si una bolsa de semilla pesa 2.5 kg, ¿cuántas bolsas necesito para tener 10 kg?',
                options: [
                  { id: 'A', text: '2 bolsas' },
                  { id: 'B', text: '3 bolsas' },
                  { id: 'C', text: '4 bolsas' },
                  { id: 'D', text: '5 bolsas' },
                ],
                correctAnswer: 'C',
                explanation: '10 kg ÷ 2.5 kg por bolsa = 4 bolsas',
              },
            ],
          },
        },
      ];

      await this.repository.save(
        lessons.map((lesson) => this.repository.create(lesson)),
      );
    }
  }
}
