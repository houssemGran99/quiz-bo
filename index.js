const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb+srv://HoussemNinja:hunterxhunter@cluster0.d60sb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(console.log("connected to the DB"));

const questionSchema = new mongoose.Schema({
  text: String,
  answers: [String],
  correctAnswer:String
});

app.use(express.static("public"));

app.use(cors());

const Question = mongoose.model("Question", questionSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())

// Show form to create a question
app.get("/", (req, res) => {
  res.render("index");
});

// Handle form submission
app.post("/add-question", async (req, res) => {
  
  const { question, answer1, answer2, answer3 , correctAnswer} = req.body;
  
  const newQuestion = new Question({
    text: question,
    answers: [answer1, answer2, answer3],
    correctAnswer : correctAnswer
  });

  await newQuestion.save();
  res.redirect("/");
});

// Display all questions
app.get("/questions", async (req, res) => {
  const questions = await Question.find();
  res.render("questions", { questions });
});

// API Route to Fetch Questions
app.get("/api/questions", async (req, res) => {
  try {
      const questions = await Question.find();
      res.json(questions);
  } catch (error) {
      res.status(500).json({ message: "Error fetching questions", error });
  }
});


// API endpoint to save question
/* app.post("/api/question", async (req, res) => {
  console.log(req.body);
  
  try {
    const { text, answers } = req.body;

    
    //console.log(text);
    //console.log(answers);
    
    
    if (!text || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Invalid input" });
    }
    const newQuestion = new Question({ text, answers });
    await newQuestion.save();
    res.status(201).json({ message: "Question saved" });
  } catch (error) {
    console.error("❌ Error saving question:", error);
    res.status(500).json({ message: "Failed to save question", error: error.message });
  }
}); */


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
