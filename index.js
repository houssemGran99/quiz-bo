const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const text = require("body-parser/lib/types/text");
require('dotenv').config()

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb+srv://HoussemNinja:"+process.env.DB_PASSWORD+"@cluster0.d60sb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(console.log("connected to the DB"));

const questionSchema = new mongoose.Schema({
  text: String,
  answers: [String],
  correctAnswer:String
});


const labelsSchema = new mongoose.Schema({
  label1 : String,
  label2 : String,
  label3 : String,
  lesson : String
})


const Question = mongoose.model("Question", questionSchema);
const Labels = mongoose.model("Labels",labelsSchema);


app.use(express.static("public"));
app.use(cors());



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


// Delete a question
app.post("/delete-question/:id", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.redirect("/questions");
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).send("Error deleting question");
  }
});


// Show form to create a label
app.get("/add-label", (req, res) => {
  res.render("add-label");
});

// Handle form submission for labels
app.post("/add-label", async (req, res) => {
  const { key, label } = req.body;
  
  const newLabel = new Labels({
    key: key,
    label: label
  });

  console.log(newLabel);
  

  await newLabel.save();
  res.redirect("/add-label");
});

// Display all labels
app.get("/labels", async (req, res) => {
  const labels = await Labels.find();
  res.render("labels", { labels });
});

// API Route to Fetch Labels
app.get("/api/labels", async (req, res) => {
  try {
      const labels = await Labels.find();
      res.json(labels);
  } catch (error) {
      res.status(500).json({ message: "Error fetching labels", error });
  }
});

// Delete a label
app.post("/delete-label/:id", async (req, res) => {
  try {
    await Labels.findByIdAndDelete(req.params.id);
    res.redirect("/labels");
  } catch (error) {
    console.error("Error deleting label:", error);
    res.status(500).send("Error deleting label");
  }
});

// Handle form submission for updating labels
app.post("/update-label/:id", async (req, res) => {
  try {
    const { label1, label2, label3, lesson } = req.body;
    await Labels.findByIdAndUpdate(req.params.id, {
      label1,
      label2,
      label3,
      lesson
    });
    res.redirect("/labels");
  } catch (error) {
    console.error("Error updating label:", error);
    res.status(500).send("Error updating label");
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
