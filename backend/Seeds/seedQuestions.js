import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import Question from '../models/Question.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ✅ Sample questions
const questions = [
  // Easy MCQs
  {
    text: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: "Paris",
    difficulty: "Easy",
    type: "MCQ",
    explanation: "Paris is the capital and most populous city of France."
  },
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars",
    difficulty: "Easy",
    type: "MCQ",
    explanation: "Mars is often called the 'Red Planet' because of its reddish appearance."
  },
  {
    text: "What is 5 + 3?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
    difficulty: "Easy",
    type: "MCQ",
    explanation: "5 + 3 equals 8."
  },
  {
    text: "Which animal is known as the King of the Jungle?",
    options: ["Tiger", "Elephant", "Lion", "Giraffe"],
    correctAnswer: "Lion",
    difficulty: "Easy",
    type: "MCQ",
    explanation: "The lion is often referred to as the 'King of the Jungle' due to its majestic appearance and position as a top predator."
  },
  {
    text: "What color do you get when you mix red and white?",
    options: ["Pink", "Orange", "Purple", "Brown"],
    correctAnswer: "Pink",
    difficulty: "Easy",
    type: "MCQ",
    explanation: "Mixing red and white paint results in the color pink."
  },
  {
    text: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: "Carbon Dioxide",
    difficulty: "Easy",
    type: "MCQ",
    explanation: "Plants absorb carbon dioxide from the atmosphere for photosynthesis."
  },
  {
    text: "Which shape has three sides?",
    options: ["Square", "Triangle", "Circle", "Rectangle"],
    correctAnswer: "Triangle",
    difficulty: "Easy",
    type: "MCQ",
    explanation: "A triangle is a polygon with three edges and three vertices."
  },
  {
    text: "What is the boiling point of water?",
    options: ["50°C", "100°C", "150°C", "200°C"],
    correctAnswer: "100°C",
    difficulty: "Easy",
    type: "MCQ",
    explanation: "Water boils at 100 degrees Celsius at standard atmospheric pressure."
  },
  {
    text: "Which fruit is yellow and curved?",
    options: ["Apple", "Banana", "Grapes", "Orange"],
    correctAnswer: "Banana",
    difficulty: "Easy",
    type: "MCQ",
    explanation: "Bananas are typically yellow and have a curved shape."
  },
  {
    text: "Which day comes after Monday?",
    options: ["Sunday", "Tuesday", "Wednesday", "Friday"],
    correctAnswer: "Tuesday",
    difficulty: "Easy",
    type: "MCQ",
    explanation: "Tuesday is the day that follows Monday in the week."
  },

  // Medium MCQs
  {
    text: "Which element has the chemical symbol 'O'?",
    options: ["Osmium", "Oxygen", "Gold", "Iron"],
    correctAnswer: "Oxygen",
    difficulty: "Medium",
    type: "MCQ",
    explanation: "The chemical symbol 'O' stands for Oxygen."
  },
  {
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: "William Shakespeare",
    difficulty: "Medium",
    type: "MCQ",
    explanation: "'Romeo and Juliet' is a tragedy written by William Shakespeare."
  },
  {
    text: "What is the square root of 144?",
    options: ["10", "11", "12", "13"],
    correctAnswer: "12",
    difficulty: "Medium",
    type: "MCQ",
    explanation: "The square root of 144 is 12 because 12 x 12 = 144."
  },
  {
    text: "Which organ pumps blood throughout the body?",
    options: ["Liver", "Heart", "Lungs", "Kidneys"],
    correctAnswer: "Heart",
    difficulty: "Medium",
    type: "MCQ",
    explanation: "The heart is responsible for pumping blood throughout the body."
  },
  {
    text: "Which country is known for the Great Wall?",
    options: ["India", "China", "Japan", "Thailand"],
    correctAnswer: "China",
    difficulty: "Medium",
    type: "MCQ",
    explanation: "The Great Wall of China is a historic fortification in China."
  },
  {
    text: "What is the freezing point of water?",
    options: ["0°C", "32°C", "100°C", "273°C"],
    correctAnswer: "0°C",
    difficulty: "Medium",
    type: "MCQ",
    explanation: "Water freezes at 0 degrees Celsius."
  },
  {
    text: "Which continent is the Sahara Desert located in?",
    options: ["Asia", "Africa", "Australia", "Europe"],
    correctAnswer: "Africa",
    difficulty: "Medium",
    type: "MCQ",
    explanation: "The Sahara Desert is located in northern Africa."
  },
  {
    text: "Which gas is most abundant in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: "Nitrogen",
    difficulty: "Medium",
    type: "MCQ",
    explanation: "Nitrogen makes up about 78% of Earth's atmosphere."
  },
  {
    text: "Which planet has the most moons?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Saturn",
    difficulty: "Medium",
    type: "MCQ",
    explanation: "As of current knowledge, Saturn has the most moons of any planet in our solar system."
  },
  {
    text: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale",
    difficulty: "Medium",
    type: "MCQ",
    explanation: "The Blue Whale is the largest mammal on Earth."
  },

  // Hard MCQs
  {
    text: "What is the derivative of sin(x)?",
    options: ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"],
    correctAnswer: "cos(x)",
    difficulty: "Hard",
    type: "MCQ",
    explanation: "The derivative of sin(x) with respect to x is cos(x)."
  },
  {
    text: "Which particle has no electric charge?",
    options: ["Electron", "Proton", "Neutron", "Photon"],
    correctAnswer: "Neutron",
    difficulty: "Hard",
    type: "MCQ",
    explanation: "Neutrons are subatomic particles with no electric charge."
  },
  {
    text: "Who developed the theory of general relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo", "Stephen Hawking"],
    correctAnswer: "Albert Einstein",
    difficulty: "Hard",
    type: "MCQ",
    explanation: "Albert Einstein developed the theory of general relativity."
  },
  {
    text: "What is the capital of Kazakhstan?",
    options: ["Astana", "Almaty", "Tashkent", "Bishkek"],
    correctAnswer: "Astana",
    difficulty: "Hard",
    type: "MCQ",
    explanation: "Astana, now called Nur-Sultan, is the capital of Kazakhstan."
  },
  {
    text: "Which programming language is primarily used for data science?",
    options: ["Java", "Python", "C++", "Ruby"],
    correctAnswer: "Python",
    difficulty: "Hard",
    type: "MCQ",
    explanation: "Python is widely used in data science due to its simplicity and extensive libraries."
  },
  {
    text: "What is the chemical formula for glucose?",
    options: ["C6H12O6", "CO2", "H2O", "CH4"],
    correctAnswer: "C6H12O6",
    difficulty: "Hard",
    type: "MCQ",
    explanation: "The chemical formula for glucose is C6H12O6."
  },
  {
    text: "Which layer of Earth lies beneath the crust?",
    options: ["Mantle", "Core", "Lithosphere", "Stratosphere"],
    correctAnswer: "Mantle",
    difficulty: "Hard",
    type: "MCQ",
    explanation: "The mantle is the layer of Earth located directly beneath the crust."
  },
  {
    text: "What is the SI unit of electric current?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    correctAnswer: "Ampere",
    difficulty: "Hard",
    type: "MCQ",
    explanation: "The SI unit of electric current is the Ampere."
  },
  {
    text: "Which country has the most official languages?",
    options: ["India", "South Africa", "Switzerland", "Canada"],
    correctAnswer: "South Africa",
    difficulty: "Hard",
    type: "MCQ",
    explanation: "South Africa has 11 official languages, the most of any country."
  },
  {
    text: "Which blood type is known as the universal donor?",
    options: ["A", "B", "AB", "O negative"],
    correctAnswer: "O negative",
    difficulty: "Hard",
    type: "MCQ",
    explanation: "O negative blood type is considered the universal donor because it can be given to patients of any blood type."
  },

  // Easy True/False
  { text: "The sun rises in the east.", correctAnswer: "true",options: ['True', 'False'], difficulty: "Easy", type: "TrueFalse", explanation: "The sun appears to rise in the east due to Earth's rotation." },
  { text: "Cats can fly naturally.", correctAnswer: "false", options: ['True', 'False'], difficulty: "Easy", type: "TrueFalse", explanation: "Cats cannot fly; they are terrestrial animals." },
  { text: "Water freezes at 0°C.", correctAnswer: "true",options: ['True', 'False'], difficulty: "Easy", type: "TrueFalse", explanation: "Water freezes at 0 degrees Celsius under standard atmospheric conditions." },
  { text: "Fish can breathe air like humans.", correctAnswer: "false",options: ['True', 'False'], difficulty: "Easy", type: "TrueFalse", explanation: "Fish extract oxygen from water using gills, not by breathing air." },
  { text: "A triangle has three sides.", correctAnswer: "true",options: ['True', 'False'], difficulty: "Easy", type: "TrueFalse", explanation: "By definition, a triangle is a polygon with three sides." },
  { text: "The moon is made of cheese.", correctAnswer: "false", options: ['True', 'False'], difficulty: "Easy", type: "TrueFalse", explanation: "The moon is made of rock and dust, not cheese." },
  { text: "Humans need oxygen to survive.", correctAnswer: "true",options: ['True', 'False'], difficulty: "Easy", type: "TrueFalse", explanation: "Oxygen is essential for human respiration and survival." },
  { text: "Dogs are reptiles.", correctAnswer: "false",options: ['True', 'False'], difficulty: "Easy", type: "TrueFalse", explanation: "Dogs are mammals, not reptiles." },
  { text: "Rain is a form of precipitation.", correctAnswer: "true",options: ['True', 'False'], difficulty: "Easy", type: "TrueFalse", explanation: "Rain is indeed a form of precipitation that falls from clouds." },
  { text: "The Earth is flat.", correctAnswer: "false",options: ['True', 'False'], difficulty: "Easy", type: "TrueFalse", explanation: "The Earth is an oblate spheroid, not flat." },

  // Medium True/False
  { text: "The human body has 206 bones.", correctAnswer: "true",options: ['True', 'False'], difficulty: "Medium", type: "TrueFalse", explanation: "An adult human body typically has 206 bones." },
  { text: "Sound travels faster than light.", correctAnswer: "false",options: ['True', 'False'], difficulty: "Medium", type: "TrueFalse", explanation: "Light travels much faster than sound." },
  { text: "The Great Wall of China is visible from space.", correctAnswer: "false",options: ['True', 'False'], difficulty: "Medium", type: "TrueFalse", explanation: "The Great Wall is not easily visible from space without aid." },
  { text: "Venus is the hottest planet in our solar system.", correctAnswer: "true", options: ['True', 'False'],difficulty: "Medium", type: "TrueFalse", explanation: "Venus has a thick atmosphere that traps heat, making it the hottest planet." },
  { text: "Water boils at 90°C at sea level.", correctAnswer: "false",options: ['True', 'False'], difficulty: "Medium", type: "TrueFalse", explanation: "Water boils at 100 degrees Celsius at sea level." },
  { text: "Sharks are mammals.", correctAnswer: "false", options: ['True', 'False'],difficulty: "Medium", type: "TrueFalse", explanation: "Sharks are fish, not mammals." },
  { text: "The capital of Australia is Sydney.", correctAnswer: "false",options: ['True', 'False'], difficulty: "Medium", type: "TrueFalse", explanation: "The capital of Australia is Canberra." },
  { text: "The Amazon rainforest produces more than 20% of the world's oxygen.", correctAnswer: "true",options: ['True', 'False'], difficulty: "Medium", type: "TrueFalse", explanation: "The Amazon rainforest is often referred to as the 'lungs of the Earth'." },
  { text: "Mount Kilimanjaro is located in Kenya.", correctAnswer: "false", options: ['True', 'False'],difficulty: "Medium", type: "TrueFalse", explanation: "Mount Kilimanjaro is located in Tanzania." },
  { text: "The human brain uses about 20% of the body's energy.", correctAnswer: "true", options: ['True', 'False'],difficulty: "Medium", type: "TrueFalse", explanation: "The brain is energy-intensive, consuming about 20% of the body's total energy." },

  // Hard True/False
  { text: "Quantum entanglement allows particles to affect each other instantly over any distance.", correctAnswer: "true", options: ['True', 'False'],difficulty: "Hard", type: "TrueFalse", explanation: "Quantum entanglement is a phenomenon where particles become linked and can instantaneously affect each other regardless of distance." },
  { text: "The speed of light is approximately 300,000 kilometers per second.", correctAnswer: "true",options: ['True', 'False'], difficulty: "Hard", type: "TrueFalse", explanation: "The speed of light in a vacuum is about 299,792 kilometers per second, often rounded to 300,000 km/s." },
  { text: "DNA stands for Deoxyribonucleic Acid.", correctAnswer: "true",options: ['True', 'False'], difficulty: "Hard", type: "TrueFalse", explanation: "DNA is the molecule that carries genetic instructions in living organisms." },
  { text: "The Second Law of Thermodynamics states that entropy in a closed system always decreases.", correctAnswer: "false",options: ['True', 'False'], difficulty: "Hard", type: "TrueFalse", explanation: "The Second Law of Thermodynamics states that entropy in a closed system always increases." },
  { text: "Pluto is currently classified as a planet.", correctAnswer: "false",options: ['True', 'False'], difficulty: "Hard", type: "TrueFalse", explanation: "Pluto was reclassified as a dwarf planet by the International Astronomical Union in 2006." },
  { text: "The Higgs boson is also known as the 'God particle'.",options: ['True', 'False'], correctAnswer: "true", difficulty: "Hard", type: "TrueFalse", explanation: "The Higgs boson is often referred to as the 'God particle' because of its fundamental role in particle physics." },
  { text: "The square root of 2 is a rational number.", correctAnswer: "false",options: ['True', 'False'], difficulty: "Hard", type: "TrueFalse", explanation: "The square root of 2 is an irrational number; it cannot be expressed as a simple fraction." },
  { text: "Antarctica has no permanent residents.", correctAnswer: "true",options: ['True', 'False'], difficulty: "Hard", type: "TrueFalse", explanation: "Antarctica does not have any permanent residents; only temporary researchers and scientists stay there." },
  { text: "The Large Hadron Collider is located in Germany.", correctAnswer: "false",options: ['True', 'False'], difficulty: "Hard", type: "TrueFalse", explanation: "The Large Hadron Collider is located at CERN, near Geneva, Switzerland." },
  { text: "The human genome contains over 3 billion base pairs.", correctAnswer: "true",options: ['True', 'False'], difficulty: "Hard", type: "TrueFalse", explanation: "The human genome consists of approximately 3 billion base pairs of DNA." },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    await Question.deleteMany(); // Optional: clear existing
    await Question.insertMany(questions);
    console.log(`✅ Seeded ${questions.length} questions`);

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
}

seedDB();
