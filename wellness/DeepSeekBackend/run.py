import subprocess
import sys
import os
import webbrowser
import time
import platform
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set Ollama path for Windows
OLLAMA_PATH = os.environ.get('OLLAMA_PATH', 'C:\\Users\\qc_de\\AppData\\Local\\Programs\\Ollama\\ollama.exe')

def check_ollama_running():
    """Check if Ollama is running"""
    system = platform.system().lower()
    
    if system == "windows":
        try:
            # Check if Ollama process is running on Windows
            result = subprocess.run(["tasklist", "/FI", "IMAGENAME eq ollama.exe"], 
                                   stdout=subprocess.PIPE, 
                                   stderr=subprocess.PIPE,
                                   text=True)
            return "ollama.exe" in result.stdout
        except:
            return False
    else:
        # For Linux/macOS, try to connect to Ollama's default port
        try:
            import socket
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(1)
            s.connect(('localhost', 11434))
            s.close()
            return True
        except:
            return False

def start_ollama():
    """Start Ollama if it's not running"""
    system = platform.system().lower()
    
    if system == "windows":
        print("Starting Ollama...")
        try:
            # Start Ollama in the background on Windows using the full path
            subprocess.Popen([OLLAMA_PATH, "serve"], 
                            creationflags=subprocess.CREATE_NEW_CONSOLE)
            # Give it some time to start
            time.sleep(5)
            return True
        except Exception as e:
            print(f"Failed to start Ollama: {e}")
            print("Please start it manually.")
            return False
    else:
        print("Starting Ollama...")
        try:
            # Start Ollama in the background on Linux/macOS
            subprocess.Popen([OLLAMA_PATH, "serve"], 
                           stdout=subprocess.DEVNULL, 
                           stderr=subprocess.DEVNULL)
            # Give it some time to start
            time.sleep(5)
            return True
        except:
            print("Failed to start Ollama. Please start it manually.")
            return False

def check_deepseek_model():
    """Check if DeepSeek model is downloaded"""
    try:
        result = subprocess.run([OLLAMA_PATH, "list"], 
                               stdout=subprocess.PIPE, 
                               stderr=subprocess.PIPE,
                               text=True)
        return "deepseek" in result.stdout.lower()
    except Exception as e:
        print(f"Error checking DeepSeek model: {e}")
        return False

def run_flask_app():
    """Run the Flask application"""
    print("Starting Flask application...")
    try:
        # Add Ollama directory to PATH
        ollama_dir = os.path.dirname(OLLAMA_PATH)
        if ollama_dir not in os.environ['PATH']:
            os.environ['PATH'] = ollama_dir + os.pathsep + os.environ['PATH']
        
        # Start Flask app
        flask_process = subprocess.Popen([sys.executable, "app.py"])
        
        # Wait a moment for the server to start
        time.sleep(2)
        
        # Open browser
        webbrowser.open("http://localhost:5000")
        
        print("Flask application is running!")
        print("Press Ctrl+C to stop the application")
        
        # Keep the script running until user interrupts
        flask_process.wait()
    except KeyboardInterrupt:
        print("\nStopping Flask application...")
        flask_process.terminate()
    except Exception as e:
        print(f"Error running Flask application: {e}")

def main():
    """Main function to run the application"""
    print("Starting DeepSeek Flask Backend...")
    
    # Check if Ollama is running
    if not check_ollama_running():
        print("Ollama is not running.")
        start_ollama()
    else:
        print("✓ Ollama is already running")
    
    # Check if DeepSeek model is downloaded
    if not check_deepseek_model():
        print("DeepSeek model is not downloaded or still downloading.")
        print("Please run 'python setup.py' first to download the model.")
        print(f"Or run: {OLLAMA_PATH} pull deepseek-r1:1.5b")
        choice = input("Do you want to try running the app anyway? (y/n): ").lower()
        if choice != 'y':
            sys.exit(1)
    else:
        print("✓ DeepSeek model is available")
    
    # Run Flask app
    run_flask_app()

if __name__ == "__main__":
    main() 