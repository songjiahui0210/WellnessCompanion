# DeepSeek Flask Backend

A simple Flask backend application that uses DeepSeek AI model locally through Ollama.

## Prerequisites

- Python 3.8 or higher
- [Ollama](https://ollama.ai/) installed on your system

## Setup Instructions

1. **Install Ollama**

   Download and install Ollama from [https://ollama.ai/](https://ollama.ai/)

2. **Download DeepSeek Model**

   After installing Ollama, open a terminal and run:

   ```bash
   # For a smaller model (recommended for systems with limited resources)
   ollama pull deepseek-r1:1.5b
   
   # For a larger, more capable model (requires more RAM)
   ollama pull deepseek-r1:8b
   ```

3. **Install Python Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask Application**

   ```bash
   python app.py
   ```

5. **Access the Application**

   Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## API Endpoints

- `GET /` - Web interface for chatting with DeepSeek
- `POST /api/chat` - Send a message to DeepSeek
  - Request body: `{"message": "Your message here", "model": "deepseek-r1:1.5b"}`
- `GET /api/models` - List available DeepSeek models

## Troubleshooting

- If you encounter errors, make sure Ollama is running in the background
- For systems with limited RAM, use the smaller 1.5B model
- If the model is slow to respond, consider reducing the complexity of your queries

## License

This project is open source and available under the MIT License. 