"""
Gemini AI Service Module for Student AI Assistant
Handles communication with Google Gemini API for intelligent student tutoring, homework help, explanations, and study assistance.
"""

import os
from config import GEMINI_API_KEY

_gemini_initialized = False

def init_gemini():
    """Initializes Google Generative AI with the API key."""
    global _gemini_initialized
    api_key = GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        print("Notice: GEMINI_API_KEY is not set. Gemini service will provide fallback helpful answers.")
        return False
        
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        _gemini_initialized = True
        return True
    except Exception as e:
        print(f"Error configuring Gemini SDK: {e}")
        return False

def generate_student_response(question, conversation_history=None, subject=None):
    """
    Generates a helpful, structured educational response for a student.
    
    Args:
        question (str): Student's query or homework problem.
        conversation_history (list): Optional list of prior chat dicts with 'question' and 'response'.
        subject (str): Optional academic subject (Math, Science, History, Coding, Literature, etc.)
        
    Returns:
        str: AI tutor response in markdown format.
    """
    if not question or not question.strip():
        return "Please ask a question so I can help you with your studies!"

    system_instruction = (
        "You are 'Student AI Assistant', an encouraging, expert, and pedagogical academic tutor for students. "
        "Your goals are:\n"
        "1. Provide crystal-clear, step-by-step explanations rather than just giving away final answers.\n"
        "2. Break down complex math, science, programming, history, and language arts concepts.\n"
        "3. Use clean Markdown formatting, bullet points, headers, bold text, and code blocks where appropriate.\n"
        "4. Include quick practice tips, mnemonic devices, or self-check questions when helpful.\n"
        "5. Keep the tone warm, motivating, polite, and student-centric."
    )

    api_key = GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
    
    if api_key:
        try:
            import google.generativeai as genai
            if not _gemini_initialized:
                init_gemini()
                
            # Use gemini-1.5-flash or gemini-2.5-flash
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=system_instruction
            )
            
            prompt = ""
            if subject and subject != "General":
                prompt += f"[Subject: {subject}]\n"
                
            if conversation_history:
                # Include last 3 exchanges for context
                prompt += "Previous conversation context:\n"
                for msg in conversation_history[-3:]:
                    q = msg.get("question", "")
                    r = msg.get("response", "")
                    prompt += f"Student: {q}\nAssistant: {r}\n\n"
                    
            prompt += f"Current Student Question: {question.strip()}"
            
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text
                
        except Exception as e:
            print(f"Gemini API invocation error: {e}")
            return (
                f"### Explanation & Guidance\n\n"
                f"I processed your question: **{question.strip()}**\n\n"
                f"**Key Concepts:**\n"
                f"- Understand the fundamental principles behind the topic.\n"
                f"- Break down the problem into smaller, sequential components.\n"
                f"- Review relevant formulas, syntax, or dates.\n\n"
                f"> *Note: To connect live Gemini AI responses, ensure your GEMINI_API_KEY is configured in `config.py` or your `.env` file.*"
            )
            
    # Default educational response if API key is not configured
    return (
        f"### Study Guide & Explanation\n\n"
        f"**Question:** {question.strip()}\n\n"
        f"Here is a structured breakdown to solve and understand this:\n\n"
        f"1. **Core Concept:** Identify the main topic and required definitions.\n"
        f"2. **Step-by-Step Approach:**\n"
        f"   - Step 1: List all given variables and constraints.\n"
        f"   - Step 2: Apply the governing rule, theorem, or logic.\n"
        f"   - Step 3: Validate the outcome against initial conditions.\n"
        f"3. **Study Tip:** Practice similar variations to reinforce your intuition.\n\n"
        f"*Configure your `GEMINI_API_KEY` in `config.py` or `.env` to receive real-time generative responses from Google Gemini.*"
    )
