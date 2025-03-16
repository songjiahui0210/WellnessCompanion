from flask import Flask, request, jsonify, render_template
import ollama
import os
import sys
import subprocess
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set Ollama path for Windows
OLLAMA_PATH = os.environ.get('OLLAMA_PATH', 'C:\\Users\\qc_de\\AppData\\Local\\Programs\\Ollama\\ollama.exe')

# Default system prompt
DEFAULT_SYSTEM_PROMPT = """You are a helpful, accurate, and concise assistant. 
When answering questions:
- Provide factually correct information
- If you're unsure about something, say so rather than making up information
- Format your responses with proper Markdown for readability
- Use bullet points and numbered lists for clarity when appropriate
- Keep your answers focused and to the point"""

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    model_name = data.get('model', 'deepseek-r1:1.5b')  # Default to smaller model
    system_prompt = data.get('system_prompt', DEFAULT_SYSTEM_PROMPT)
    temperature = data.get('temperature', 0.7)  # Default temperature
    
    try:
        # Call the DeepSeek model through Ollama
        response = ollama.chat(
            model=model_name,
            messages=[
                {
                    'role': 'system',
                    'content': system_prompt
                },
                {
                    'role': 'user',
                    'content': user_message,
                }
            ],
            options={
                'temperature': float(temperature)
            }
        )
        
        return jsonify({
            'response': response['message']['content'],
            'model': model_name
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/models', methods=['GET'])
def list_models():
    try:
        models = ollama.list()
        deepseek_models = [model for model in models['models'] 
                          if 'deepseek' in model['name'].lower()]
        return jsonify(deepseek_models)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Add Ollama directory to PATH if not already there
    ollama_dir = os.path.dirname(OLLAMA_PATH)
    if ollama_dir not in os.environ['PATH']:
        os.environ['PATH'] = ollama_dir + os.pathsep + os.environ['PATH']
        
    app.run(debug=True, host='0.0.0.0', port=5000) 