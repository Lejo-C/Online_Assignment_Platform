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
    answer: "Paris",
    difficulty: "Easy",
    type: "MCQ"
  },
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
    difficulty: "Easy",
    type: "MCQ"
  },
  {
    text: "What is 5 + 3?",
    options: ["6", "7", "8", "9"],
    answer: "8",
    difficulty: "Easy",
    type: "MCQ"
  },
  {
    text: "Which animal is known as the King of the Jungle?",
    options: ["Tiger", "Elephant", "Lion", "Giraffe"],
    answer: "Lion",
    difficulty: "Easy",
    type: "MCQ"
  },
  {
    text: "What color do you get when you mix red and white?",
    options: ["Pink", "Orange", "Purple", "Brown"],
    answer: "Pink",
    difficulty: "Easy",
    type: "MCQ"
  },
  {
    text: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    answer: "Carbon Dioxide",
    difficulty: "Easy",
    type: "MCQ"
  },
  {
    text: "Which shape has three sides?",
    options: ["Square", "Triangle", "Circle", "Rectangle"],
    answer: "Triangle",
    difficulty: "Easy",
    type: "MCQ"
  },
  {
    text: "What is the boiling point of water?",
    options: ["50°C", "100°C", "150°C", "200°C"],
    answer: "100°C",
    difficulty: "Easy",
    type: "MCQ"
  },
  {
    text: "Which fruit is yellow and curved?",
    options: ["Apple", "Banana", "Grapes", "Orange"],
    answer: "Banana",
    difficulty: "Easy",
    type: "MCQ"
  },
  {
    text: "Which day comes after Monday?",
    options: ["Sunday", "Tuesday", "Wednesday", "Friday"],
    answer: "Tuesday",
    difficulty: "Easy",
    type: "MCQ"
  },

  // Medium MCQs
  {
    text: "Which element has the chemical symbol 'O'?",
    options: ["Osmium", "Oxygen", "Gold", "Iron"],
    answer: "Oxygen",
    difficulty: "Medium",
    type: "MCQ"
  },
  {
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    answer: "William Shakespeare",
    difficulty: "Medium",
    type: "MCQ"
  },
  {
    text: "What is the square root of 144?",
    options: ["10", "11", "12", "13"],
    answer: "12",
    difficulty: "Medium",
    type: "MCQ"
  },
  {
    text: "Which organ pumps blood throughout the body?",
    options: ["Liver", "Heart", "Lungs", "Kidneys"],
    answer: "Heart",
    difficulty: "Medium",
    type: "MCQ"
  },
  {
    text: "Which country is known for the Great Wall?",
    options: ["India", "China", "Japan", "Thailand"],
    answer: "China",
    difficulty: "Medium",
    type: "MCQ"
  },
  {
    text: "What is the freezing point of water?",
    options: ["0°C", "32°C", "100°C", "273°C"],
    answer: "0°C",
    difficulty: "Medium",
    type: "MCQ"
  },
  {
    text: "Which continent is the Sahara Desert located in?",
    options: ["Asia", "Africa", "Australia", "Europe"],
    answer: "Africa",
    difficulty: "Medium",
    type: "MCQ"
  },
  {
    text: "Which gas is most abundant in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    answer: "Nitrogen",
    difficulty: "Medium",
    type: "MCQ"
  },
  {
    text: "Which planet has the most moons?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Saturn",
    difficulty: "Medium",
    type: "MCQ"
  },
  {
    text: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    answer: "Blue Whale",
    difficulty: "Medium",
    type: "MCQ"
  },

  // Hard MCQs
  {
    text: "What is the derivative of sin(x)?",
    options: ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"],
    answer: "cos(x)",
    difficulty: "Hard",
    type: "MCQ"
  },
  {
    text: "Which particle has no electric charge?",
    options: ["Electron", "Proton", "Neutron", "Photon"],
    answer: "Neutron",
    difficulty: "Hard",
    type: "MCQ"
  },
  {
    text: "Who developed the theory of general relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo", "Stephen Hawking"],
    answer: "Albert Einstein",
    difficulty: "Hard",
    type: "MCQ"
  },
  {
    text: "What is the capital of Kazakhstan?",
    options: ["Astana", "Almaty", "Tashkent", "Bishkek"],
    answer: "Astana",
    difficulty: "Hard",
    type: "MCQ"
  },
  {
    text: "Which programming language is primarily used for data science?",
    options: ["Java", "Python", "C++", "Ruby"],
    answer: "Python",
    difficulty: "Hard",
    type: "MCQ"
  },
  {
    text: "What is the chemical formula for glucose?",
    options: ["C6H12O6", "CO2", "H2O", "CH4"],
    answer: "C6H12O6",
    difficulty: "Hard",
    type: "MCQ"
  },
  {
    text: "Which layer of Earth lies beneath the crust?",
    options: ["Mantle", "Core", "Lithosphere", "Stratosphere"],
    answer: "Mantle",
    difficulty: "Hard",
    type: "MCQ"
  },
  {
    text: "What is the SI unit of electric current?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    answer: "Ampere",
    difficulty: "Hard",
    type: "MCQ"
  },
  {
    text: "Which country has the most official languages?",
    options: ["India", "South Africa", "Switzerland", "Canada"],
    answer: "South Africa",
    difficulty: "Hard",
    type: "MCQ"
  },
  {
    text: "Which blood type is known as the universal donor?",
    options: ["A", "B", "AB", "O negative"],
    answer: "O negative",
    difficulty: "Hard",
    type: "MCQ"
  },

  // Easy True/False
  { text: "The sun rises in the east.", answer: "true", difficulty: "Easy", type: "TrueFalse" },
  { text: "Cats can fly naturally.", answer: "false", difficulty: "Easy", type: "TrueFalse" },
  { text: "Water freezes at 0°C.", answer: "true", difficulty: "Easy", type: "TrueFalse" },
  { text: "Fish can breathe air like humans.", answer: "false", difficulty: "Easy", type: "TrueFalse" },
  { text: "A triangle has three sides.", answer: "true", difficulty: "Easy", type: "TrueFalse" },
  { text: "The moon is made of cheese.", answer: "false", difficulty: "Easy", type: "TrueFalse" },
    { text: "Humans need oxygen to survive.", answer: "true", difficulty: "Easy", type: "TrueFalse" },
  { text: "Dogs are reptiles.", answer: "false", difficulty: "Easy", type: "TrueFalse" },
  { text: "Rain is a form of precipitation.", answer: "true", difficulty: "Easy", type: "TrueFalse" },
  { text: "The Earth is flat.", answer: "false", difficulty: "Easy", type: "TrueFalse" },

  // Medium True/False
  { text: "The human body has 206 bones.", answer: "true", difficulty: "Medium", type: "TrueFalse" },
  { text: "Sound travels faster than light.", answer: "false", difficulty: "Medium", type: "TrueFalse" },
  { text: "The Great Wall of China is visible from space.", answer: "false", difficulty: "Medium", type: "TrueFalse" },
  { text: "Venus is the hottest planet in our solar system.", answer: "true", difficulty: "Medium", type: "TrueFalse" },
  { text: "Water boils at 90°C at sea level.", answer: "false", difficulty: "Medium", type: "TrueFalse" },
  { text: "Sharks are mammals.", answer: "false", difficulty: "Medium", type: "TrueFalse" },
  { text: "The capital of Australia is Sydney.", answer: "false", difficulty: "Medium", type: "TrueFalse" },
  { text: "The Amazon rainforest produces more than 20% of the world's oxygen.", answer: "true", difficulty: "Medium", type: "TrueFalse" },
  { text: "Mount Kilimanjaro is located in Kenya.", answer: "false", difficulty: "Medium", type: "TrueFalse" },
  { text: "The human brain uses about 20% of the body's energy.", answer: "true", difficulty: "Medium", type: "TrueFalse" },

  // Hard True/False
  { text: "Quantum entanglement allows particles to affect each other instantly over any distance.", answer: "true", difficulty: "Hard", type: "TrueFalse" },
  { text: "The speed of light is approximately 300,000 kilometers per second.", answer: "true", difficulty: "Hard", type: "TrueFalse" },
  { text: "DNA stands for Deoxyribonucleic Acid.", answer: "true", difficulty: "Hard", type: "TrueFalse" },
  { text: "The Second Law of Thermodynamics states that entropy in a closed system always decreases.", answer: "false", difficulty: "Hard", type: "TrueFalse" },
  { text: "Pluto is currently classified as a planet.", answer: "false", difficulty: "Hard", type: "TrueFalse" },
  { text: "The Higgs boson is also known as the 'God particle'.", answer: "true", difficulty: "Hard", type: "TrueFalse" },
  { text: "The square root of 2 is a rational number.", answer: "false", difficulty: "Hard", type: "TrueFalse" },
  { text: "Antarctica has no permanent residents.", answer: "true", difficulty: "Hard", type: "TrueFalse" },
  { text: "The Large Hadron Collider is located in Germany.", answer: "false", difficulty: "Hard", type: "TrueFalse" },
  { text: "The human genome contains over 3 billion base pairs.", answer: "true", difficulty: "Hard", type: "TrueFalse" }
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
