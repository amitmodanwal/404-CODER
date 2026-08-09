# TEAM NAME - 404 CODER

# - TEAM MEMBER
- AMIT MODANWAL
- ADITYA SHAH
- JATIN

# LIVE DEMO - 

## 📁 Project Structure

```text
THE-INTERVIEW-AGENT/
│
├── public/
│   ├── images/
│   └── assets/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── login/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   └── candidates/
│   │   │       └── route.ts
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── interview/
│   │   │   └── page.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── report/
│   │   │   └── page.tsx
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── InterviewCard.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── VoiceInterview.tsx
│   │   ├── ScoreCard.tsx
│   │   └── ReportCard.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   │
│   └── data/
│       └── candidates.json
│
├── .env
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
├── next-env.d.ts
├── README.md
└── prompt.md


# PROJECT NAME - 🤖 SYNAPSE AI

> An AI-powered technical interview platform that conducts personalized, adaptive, and realistic interviews based on a candidate's learning journey.

## IDEA - 🚀 Overview

AI Interview Agent is an intelligent interview platform designed to help learners prepare for real-world technical interviews.

Instead of following a fixed list of questions, the AI interviewer analyzes the candidate's responses, maintains conversation context, asks intelligent follow-up questions, and evaluates the candidate at the end of the interview.

The platform is especially designed for learners who have completed an AI Engineering / AI Cohort covering technologies such as:

- Retrieval-Augmented Generation (RAG)
- Vector Databases
- Prompt Engineering
- Agentic AI
- Model Context Protocol (MCP)
- AI Deployment
- Production AI Systems

The goal is to simulate a realistic technical interview experience rather than a scripted questionnaire.

---

## 🎯 Problem Statement

Learning AI engineering concepts is only one part of becoming interview-ready.

Many learners struggle to:

- Explain technical concepts clearly
- Answer follow-up questions
- Connect different AI concepts
- Explain engineering decisions
- Handle real interview pressure
- Identify weaknesses in their technical knowledge
- Communicate their projects effectively

Traditional interview preparation tools often use predefined questions and do not adapt to the candidate's answers.

### Our Solution

AI Interview Agent provides a dynamic AI-powered interviewer that:

1. Understands the candidate's learning journey
2. Generates personalized questions
3. Conducts multi-turn interviews
4. Maintains conversation context
5. Evaluates candidate responses
6. Asks intelligent follow-up questions
7. Generates actionable feedback and performance reports

---

## ✨ Key Features

### 🧠 Personalized Interviews

The AI generates interview questions based on the candidate's completed learning topics and selected interview type.

### 🔄 Adaptive Follow-Up Questions

The interviewer dynamically changes the next question based on the candidate's previous answer.

For example:

Candidate:

> "RAG helps reduce hallucination by grounding the model with retrieved information."

AI Interviewer:

> "Good. How would you decide whether to use a vector database or keyword search for retrieval?"

This creates a realistic interview conversation.

### 💬 Multi-Turn Conversation

The AI maintains context throughout the interview instead of treating every answer as an independent question.

### 📚 Technical Topic Assessment

The platform can evaluate knowledge in areas such as:

- RAG
- Vector Databases
- Prompt Engineering
- Agentic AI
- MCP
- LLM Applications
- AI Deployment
- Production AI Systems
- System Design



### 📝 Text-Based Interview

Candidates can also type their answers when voice interaction is not preferred.

### 📄 Resume-Based Personalization

Candidates can optionally upload their resume so that interview questions can be personalized around their skills and projects.

### 📊 AI Evaluation

The system evaluates candidates across multiple dimensions:

- Technical Knowledge
- Accuracy
- Communication
- Confidence
- Problem Solving
- Depth of Understanding
- Answer Relevance
- Clarity

### 📈 Performance Dashboard

Candidates can view their interview performance through a dashboard containing:

- Overall Score
- Technical Score
- Communication Score
- Confidence Score
- Topic-wise Performance
- Strengths
- Weaknesses
- Improvement Suggestions

### 📑 Detailed Interview Report

After completing an interview, the platform generates a detailed report containing:

- Overall performance
- Question-by-question evaluation
- Correctness analysis
- Strengths
- Weaknesses
- Recommended topics
- Personalized improvement plan

---

# 🏗️ System Workflow

```text
                    ┌──────────────────┐
                    │      Login       │
                    └────────┬─────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Candidate Dashboard │
                  └──────────┬──────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │ Select Interview Type  │
                │                        │
                │ • AI Engineering       │
                │ • RAG                  │
                │ • Agentic AI           │
                │ • System Design        │
                └───────────┬────────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │ Resume Upload      │
                  │     (Optional)     │
                  └─────────┬──────────┘
                            │
                            ▼
                ┌────────────────────────┐
                │ AI Generates Question  │
                └───────────┬────────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │ Candidate Answers  │
                  │                    │
                  │ Text / Voice       │
                  └─────────┬──────────┘
                            │
                            ▼
                ┌────────────────────────┐
                │ AI Evaluates Response │
                └───────────┬────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Follow-up Question  │
                 └──────────┬──────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Next Question │
                     └──────┬───────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Interview Ends  │
                   └────────┬────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ AI Performance Report│
                 └──────────────────────┘



# 404 CODER
- Built with ❤️ for AI Engineering and technical interview preparation