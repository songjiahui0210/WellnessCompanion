# DeepSeek Backend Usage Guide

This document provides instructions on how to use the DeepSeek Flask backend application.

## Table of Contents

1. [Setup and Installation](#setup-and-installation)
2. [Running the Application](#running-the-application)
3. [Web Interface](#web-interface)
4. [API Documentation](#api-documentation)
5. [Integration Examples](#integration-examples)
6. [Testing with Postman](#testing-with-postman)
7. [Troubleshooting](#troubleshooting)

## Setup and Installation

### Prerequisites

- Python 3.8 or higher
- [Ollama](https://ollama.ai/) installed on your system

### Installation Steps

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

## Running the Application

1. **Start the Flask Application**

   ```bash
   python run.py
   ```

   This script will:
   - Check if Ollama is running and start it if needed
   - Verify that the DeepSeek model is downloaded
   - Start the Flask application
   - Open a browser window to the application

2. **Access the Application**

   Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Web Interface

The web interface provides a simple chat interface with DeepSeek:

- **Chat Area**: Where messages between you and DeepSeek are displayed
- **Input Field**: Type your messages here
- **Send Button**: Click to send your message to DeepSeek

### Advanced Settings

Click "Show Advanced Settings" to access additional options:

- **Model Selection**: Choose between different DeepSeek models
- **Temperature**: Adjust the randomness of responses (0.0-2.0)
  - Lower values (0.1-0.5): More focused, deterministic responses
  - Medium values (0.6-0.8): Balanced responses
  - Higher values (0.9-2.0): More creative, varied responses
- **System Prompt**: Customize instructions to guide the model's behavior
  - **Default**: General-purpose assistant
  - **React Expert**: Specialized for React development questions

## API Documentation

The backend exposes the following API endpoints:

### 1. Chat with DeepSeek

Send a message to the DeepSeek model and get a response.

**Endpoint:** `/api/chat`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | string | Yes | - | The user's message to send to DeepSeek |
| `model` | string | No | `deepseek-r1:1.5b` | The model name to use |
| `system_prompt` | string | No | *Default system prompt* | Custom system prompt to guide the model's responses |
| `temperature` | number | No | `0.7` | Controls randomness (0.0-2.0) |

**Response:** `200 OK`

```json
{
  "response": "The model's response text",
  "model": "deepseek-r1:1.5b"
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Error message"
}
```

### 2. List Available Models

Get a list of available DeepSeek models.

**Endpoint:** `/api/models`  
**Method:** `GET`

**Response:** `200 OK`

```json
[
  {
    "name": "deepseek-r1:1.5b",
    "modified_at": "2025-03-15T12:34:56Z",
    "size": 1500000000
  },
  {
    "name": "deepseek-r1:8b",
    "modified_at": "2025-03-15T12:34:56Z",
    "size": 8000000000
  }
]
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Error message"
}
```

## Integration Examples

### JavaScript/Fetch API

```javascript
// Chat with DeepSeek
async function chatWithDeepSeek(message, modelName = 'deepseek-r1:1.5b', systemPrompt = null, temperature = 0.7) {
  const response = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message,
      model: modelName,
      system_prompt: systemPrompt,
      temperature: temperature
    })
  });
  
  return await response.json();
}

// Get available models
async function getAvailableModels() {
  const response = await fetch('http://localhost:5000/api/models');
  return await response.json();
}

// Example usage
chatWithDeepSeek("Explain React hooks")
  .then(data => {
    console.log(data.response);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Python/Requests

```python
import requests

def chat_with_deepseek(message, model_name='deepseek-r1:1.5b', system_prompt=None, temperature=0.7):
    url = 'http://localhost:5000/api/chat'
    payload = {
        'message': message,
        'model': model_name,
        'temperature': temperature
    }
    
    if system_prompt:
        payload['system_prompt'] = system_prompt
        
    response = requests.post(url, json=payload)
    return response.json()

def get_available_models():
    url = 'http://localhost:5000/api/models'
    response = requests.get(url)
    return response.json()

# Example usage
result = chat_with_deepseek("What is React?")
print(result['response'])
```

### cURL

```bash
# Chat with DeepSeek
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is React?",
    "model": "deepseek-r1:1.5b",
    "temperature": 0.7,
    "system_prompt": "You are an expert React developer."
  }'

# List available models
curl http://localhost:5000/api/models
```

## Testing with Postman

### 1. Chat with DeepSeek Endpoint

#### Request Setup:
- **Method**: POST
- **URL**: `http://localhost:5000/api/chat`
- **Headers**: 
  - Key: `Content-Type`
  - Value: `application/json`

#### Body:
- Select **raw** and **JSON** format
- Enter this JSON:
```json
{
  "message": "What is React?",
  "model": "deepseek-r1:1.5b",
  "temperature": 0.7,
  "system_prompt": "You are an expert React developer with deep knowledge of React, JavaScript, and modern web development."
}
```

### 2. List Available Models Endpoint

#### Request Setup:
- **Method**: GET
- **URL**: `http://localhost:5000/api/models`
- No headers or body required

### Testing Different Parameters

You can experiment with different parameters in your POST request:

#### Test with Different Model:
```json
{
  "message": "What is React?",
  "model": "deepseek-r1:8b"
}
```

#### Test with Different Temperature:
```json
{
  "message": "Write a creative story about React",
  "temperature": 1.5
}
```

#### Test with Custom System Prompt:
```json
{
  "message": "Explain hooks in React",
  "system_prompt": "You are a React expert. Keep explanations simple and include code examples."
}
```

## Troubleshooting

### Common Issues

1. **Ollama Not Running**
   - Error: "Failed to connect to Ollama"
   - Solution: Start Ollama manually or run `python run.py` which will attempt to start it

2. **DeepSeek Model Not Downloaded**
   - Error: "Model not found"
   - Solution: Run `ollama pull deepseek-r1:1.5b` to download the model

3. **Port Already in Use**
   - Error: "Address already in use"
   - Solution: Stop any other applications using port 5000 or modify the port in app.py

4. **CORS Issues When Calling from Another Frontend**
   - Error: "Cross-Origin Request Blocked"
   - Solution: Install flask-cors and add CORS support to app.py:
     ```python
     from flask_cors import CORS
     app = Flask(__name__)
     CORS(app)
     ```

5. **Slow Responses**
   - Issue: Model takes too long to respond
   - Solution: Use the smaller model (deepseek-r1:1.5b) or upgrade your hardware

### Getting Help

If you encounter issues not covered here:

1. Check the Flask application logs for error messages
2. Verify Ollama is running with `tasklist | findstr ollama` (Windows) or `ps aux | grep ollama` (Linux/Mac)
3. Check that the DeepSeek model is downloaded with `ollama list` 