from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/', methods=['GET'])
def home():
    return "Flask application is running!"

@app.route('/api/models', methods=['GET'])
def get_models():
    # Return a list of available models
    models = [
        {
            "details": {
                "families": ["qwen2"],
                "family": "qwen2",
                "format": "gguf",
                "parameter_size": "1.8B",
                "quantization_level": "Q4_K_M"
            },
            "id": "qwen2-1.8b-instruct-q4_k_m.gguf",
            "name": "Qwen2 1.8B Instruct"
        }
    ]
    return jsonify(models)

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Handle direct chat requests from the frontend or other services
    """
    try:
        data = request.json
        messages = data.get('messages', [])
        model = data.get('model', 'qwen2-1.8b-instruct-q4_k_m.gguf')
        
        # Extract the system message and user message
        system_message = next((msg['content'] for msg in messages if msg['role'] == 'system'), "")
        user_message = next((msg['content'] for msg in messages if msg['role'] == 'user'), "")
        
        # Extract emotion and content from user message
        emotion = "unknown"
        content = ""
        if "feeling" in user_message:
            parts = user_message.split("feeling")
            if len(parts) > 1:
                emotion_part = parts[1].split(":")[0].strip()
                emotion = emotion_part
        
        if "\"" in user_message:
            content_parts = user_message.split("\"")
            if len(content_parts) > 2:
                content = content_parts[1]
        
        # Generate response based on the type of request
        if "analyze" in user_message.lower():
            response = generate_analysis_response(emotion, content)
        elif any(perspective in system_message.lower() for perspective in ["therapist", "friend", "parent", "mentor"]):
            # Identify which perspective is being used
            perspective = ""
            for p in ["therapist", "friend", "parent", "mentor"]:
                if p in system_message.lower():
                    perspective = p
                    break
            
            # Generate a response based on the perspective
            response = generate_advisor_response(perspective, emotion, content)
        else:
            # Generic response for other types of messages
            response = f"I've processed your message and understand what you're expressing. Your thoughts and feelings are valid, and I appreciate you sharing them. Is there a specific aspect of this situation you'd like to explore further?"
        
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({"response": "Sorry, I encountered an error while processing your request."}), 500

# Add routes for /analyze and /respond to handle direct requests without the /api/ prefix
@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_direct():
    """Handle direct requests to /analyze"""
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        return '', 204
    
    # Redirect to the /api/analyze endpoint
    return analyze()

@app.route('/respond', methods=['POST', 'OPTIONS'])
def respond_direct():
    """Handle direct requests to /respond"""
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        return '', 204
    
    # Redirect to the /api/respond endpoint
    return respond()

@app.route('/api/analyze', methods=['POST', 'OPTIONS'])
def analyze():
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        return '', 204
    
    try:
        # Get data from request
        data = request.json
        content = data.get('content', '')
        emotion = data.get('emotion', '')
        
        # Generate analysis response
        analysis = generate_analysis_response(emotion, content)
        
        return jsonify({"analysis": analysis})
    except Exception as e:
        print(f"Error in analyze endpoint: {e}")
        # Fallback response
        return jsonify({"analysis": f"Based on your entry about feeling {emotion}, it seems you're experiencing strong emotions. Your response shows self-awareness and a desire to understand these feelings better."})

@app.route('/api/respond', methods=['POST', 'OPTIONS'])
def respond():
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        return '', 204
    
    try:
        # Get data from request
        data = request.json
        content = data.get('content', '')
        emotion = data.get('emotion', '')
        advisor = data.get('advisorPerspective', '')
        ai_summary = data.get('aiSummary', '')
        
        # Generate advisor response
        response = generate_advisor_response(advisor, emotion, content)
        
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error in respond endpoint: {e}")
        # Fallback to hardcoded responses
        return generate_fallback_response(advisor, emotion)

def generate_analysis_response(emotion, content):
    """Generate an analysis response based on the emotion and content"""
    
    # Here you would integrate with your local LLM or API
    # For now, we'll use more sophisticated hardcoded responses
    
    happy_responses = [
        f"Your journal entry about feeling {emotion} reveals a positive emotional state. I notice genuine joy and contentment in your words. These positive emotions are valuable resources that can help build resilience for future challenges. Consider what specific elements contributed to this happiness and how you might intentionally incorporate more of these into your daily life.",
        
        f"I see that you're experiencing {emotion} feelings. Your entry shows appreciation for the present moment and a sense of fulfillment. Research in positive psychology suggests that savoring these moments can enhance overall well-being. What aspects of this experience would you like to remember or recreate in the future?",
        
        f"Your reflection on feeling {emotion} demonstrates emotional awareness and gratitude. I notice how you're connecting this positive emotion to specific experiences and relationships in your life. This kind of emotional intelligence helps build stronger connections and a more fulfilling life. How might you share this positive energy with others?"
    ]
    
    sad_responses = [
        f"Your journal entry about feeling {emotion} shows you're experiencing a difficult emotional period. I notice thoughtful reflection about these feelings, which is a healthy way to process them. Sadness often signals something meaningful to us has been affected. What might your sadness be telling you about what you value most?",
        
        f"I see that you're going through {emotion} feelings right now. Your entry reveals depth of emotion and self-awareness. Remember that allowing yourself to experience sadness is part of emotional health. What small comfort or self-care practice might help you navigate through this feeling today?",
        
        f"Your reflection on feeling {emotion} shows emotional honesty and vulnerability. These qualities are strengths, not weaknesses. I notice you're making connections between your feelings and your experiences, which is an important part of emotional processing. How have you moved through similar feelings in the past?"
    ]
    
    angry_responses = [
        f"Your journal entry about feeling {emotion} reveals strong emotional activation. I notice you're aware of this intense feeling, which is the first step in healthy processing. Anger often signals a boundary violation or unmet need. What might your anger be trying to protect or what need might it be pointing to?",
        
        f"I see that you're experiencing {emotion} feelings. Your entry shows self-awareness about this powerful emotion. Anger can provide important information and energy for change when channeled constructively. What would be a healthy way to express or use this emotional energy?",
        
        f"Your reflection on feeling {emotion} demonstrates emotional honesty. I notice you're connecting this feeling to specific triggers or situations. This awareness can help transform reactive anger into responsive action. What small step might help address the underlying issue causing this feeling?"
    ]
    
    anxious_responses = [
        f"Your journal entry about feeling {emotion} shows you're experiencing heightened alertness and concern. I notice thoughtful reflection about these feelings, which helps create distance from them. Anxiety often involves anticipating future threats. What specific uncertainties might be driving these feelings?",
        
        f"I see that you're going through {emotion} feelings. Your entry reveals awareness of both physical and mental aspects of anxiety. This mind-body connection is important to recognize. What grounding techniques have helped you manage similar feelings in the past?",
        
        f"Your reflection on feeling {emotion} shows emotional self-awareness. I notice patterns of anticipatory thinking that often accompany anxiety. Breaking down concerns into what's within and outside your control can be helpful. What small, manageable action might help address one aspect of what's causing these feelings?"
    ]
    
    neutral_responses = [
        f"Your journal entry reveals thoughtful reflection about your emotional experience of {emotion}. I notice patterns of self-awareness and introspection that indicate healthy emotional processing. Consider how these feelings connect to your values and what they might be telling you about your needs in this situation.",
        
        f"I see you're experiencing feelings of {emotion}. Your entry shows emotional intelligence in how you're identifying and processing these feelings. What patterns do you notice about when these emotions arise and how they influence your thoughts and behaviors?",
        
        f"Your reflection demonstrates engagement with your emotional experience of {emotion}. This kind of emotional awareness is associated with better mental health outcomes. How might these feelings be informing you about what matters most to you right now?"
    ]
    
    # Select appropriate response set based on emotion
    emotion_lower = emotion.lower()
    if any(term in emotion_lower for term in ["happy", "joy", "excited", "content", "pleased"]):
        responses = happy_responses
    elif any(term in emotion_lower for term in ["sad", "down", "depressed", "unhappy", "disappointed"]):
        responses = sad_responses
    elif any(term in emotion_lower for term in ["angry", "mad", "frustrated", "annoyed", "irritated"]):
        responses = angry_responses
    elif any(term in emotion_lower for term in ["anxious", "worried", "nervous", "stressed", "afraid"]):
        responses = anxious_responses
    else:
        responses = neutral_responses
    
    return random.choice(responses)

def generate_advisor_response(perspective, emotion, content):
    """Generate a response based on the advisor perspective"""
    
    # Here you would integrate with your local LLM or API
    # For now, we'll use more sophisticated hardcoded responses
    
    therapist_responses = [
        f"From a therapeutic perspective, I want to acknowledge the validity of your feelings of {emotion}. What you're experiencing is a natural response to your situation. I notice some themes in your entry that might be worth exploring further: how these feelings connect to past experiences, what core needs might be unmet, and what coping strategies have worked for you before. Would it help to discuss some specific techniques for managing these emotions when they feel overwhelming?",
        
        f"As your therapist, I'm hearing that you're experiencing {emotion}, and I want to validate that this is a completely understandable response to your situation. When we experience {emotion}, our bodies and minds are trying to tell us something important. Let's explore what message this emotion might be carrying for you. What physical sensations do you notice when this feeling arises? And what thoughts typically accompany it?",
        
        f"I appreciate your vulnerability in sharing these feelings of {emotion}. From a clinical perspective, emotions like this often serve as important signals about our needs and boundaries. I'm curious about when you first noticed this feeling emerging, and what patterns you might observe around when it intensifies or subsides. Developing this awareness can be a powerful tool for emotional regulation."
    ]
    
    friend_responses = [
        f"Hey, I totally get what you're going through with these {emotion} feelings right now. That sounds really tough! I've been in similar situations and it's completely normal to feel this way. Sometimes when I'm dealing with stuff like this, I try to take a step back and ask myself what I'd tell a friend going through the same thing. Maybe we could grab coffee sometime and talk more about it? Either way, I'm here for you whenever you need to vent or just want some company.",
        
        f"Oh man, feeling {emotion} is the worst sometimes! But honestly, who wouldn't feel that way in your situation? Listen, we all go through these things - I had something similar happen last year and it was super intense. Want to take your mind off things? We could catch that new movie this weekend, or just hang out and talk about literally anything else if that helps. Just know I've got your back no matter what.",
        
        f"Hey friend! I just want you to know that feeling {emotion} is totally valid and I'm right here with you. Sometimes life throws these curveballs and it's OK not to be OK for a while. Remember when I was going through that rough patch and you were there for me? Well, now it's my turn to return the favor. What do you need right now? Space, distraction, advice, or just someone to listen? I'm all in, whatever helps."
    ]
    
    parent_responses = [
        f"I care about you deeply, and it hurts to see you struggling with these {emotion} feelings. Remember that challenges like this are part of life's journey and help us grow stronger. When I was your age, I faced similar situations and learned that patience and perseverance were key. Trust your instincts—you have good judgment. And remember, no matter what happens, I'm always here for you with unconditional love and support.",
        
        f"As your parent, seeing you experience {emotion} makes me want to fix everything for you, but I know that's not always what you need. What I can offer is my unwavering support and the wisdom of someone who's weathered many storms. This feeling won't last forever, though I know it's intense right now. You come from a long line of resilient people, and that same strength is in you. What can I do to support you through this?",
        
        f"My dear child, your feelings of {emotion} are completely natural, and I'm proud of you for acknowledging them. When you were little, I could kiss away your hurts, but now I know you need different kinds of support. I believe in your ability to navigate this challenge, and I'm here to offer guidance when asked, a shoulder when needed, and love always. Remember that in our family, we don't have to face difficult times alone."
    ]
    
    mentor_responses = [
        f"Looking at your situation objectively, I see several valuable learning opportunities in these {emotion} feelings. Your emotional awareness is impressive—that's a crucial skill many people never develop. Consider framing this challenge as a chance to develop greater resilience and emotional intelligence. What specific lessons might this experience be teaching you? How might these insights serve you in future situations? I believe you have the capacity to transform this difficulty into significant personal growth.",
        
        f"As your mentor, I want to acknowledge your {emotion} feelings while also encouraging you to view this situation through a strategic lens. Every challenge contains the seeds of opportunity. The most successful individuals I've guided have been those who could extract valuable lessons from emotional experiences. What three insights could you take from this situation that might serve your long-term goals? How might you leverage this experience to develop greater emotional agility?",
        
        f"I've observed that feeling {emotion} often signals we're at an important crossroads. The most growth happens at the edge of our comfort zones, which is rarely a comfortable place to be. Consider documenting the skills you're developing through this challenge - resilience, self-awareness, and emotional regulation are highly valuable in both personal and professional contexts. What would a future version of yourself, who has mastered these skills, advise you to do now?"
    ]
    
    response_maps = {
        "therapist": therapist_responses,
        "friend": friend_responses,
        "parent": parent_responses,
        "mentor": mentor_responses
    }
    
    responses = response_maps.get(perspective, therapist_responses)
    return random.choice(responses)

def generate_fallback_response(perspective, emotion):
    """Generate a fallback response if the primary generation fails"""
    
    advisor_responses = {
        "therapist": f"From a therapeutic perspective, it's important to acknowledge that your feelings of {emotion} are valid. Your emotional response is a natural reaction to this situation. Let's explore some coping strategies that might help you process these emotions in a healthy way...",
        "friend": f"Hey, I totally get what you're going through with these {emotion} feelings. It's completely normal to feel this way, and I want you to know that I'm here for you. Have you considered looking at it this way...",
        "parent": f"I care about you deeply and it hurts to see you going through these {emotion} emotions. Remember that challenges help us grow stronger, and I believe in your ability to handle this situation. Here's what I've learned from my experience...",
        "mentor": f"Looking at your situation objectively, I see several learning opportunities here. Your emotional awareness about {emotion} is commendable, and we can use this experience to develop stronger emotional intelligence...",
    }
    
    response = advisor_responses.get(perspective, advisor_responses["friend"])
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 