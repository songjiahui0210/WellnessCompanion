import subprocess
import sys
import os
import platform
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set Ollama path for Windows
OLLAMA_PATH = os.environ.get('OLLAMA_PATH', 'C:\\Users\\qc_de\\AppData\\Local\\Programs\\Ollama\\ollama.exe')

def check_python_version():
    """Check if Python version is 3.8 or higher"""
    if sys.version_info < (3, 8):
        print("Error: Python 3.8 or higher is required")
        sys.exit(1)
    print("✓ Python version check passed")

def install_dependencies():
    """Install required Python packages"""
    print("Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✓ Dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("Error: Failed to install dependencies")
        sys.exit(1)

def check_ollama():
    """Check if Ollama is installed"""
    try:
        # First try using the PATH
        result = subprocess.run(["ollama", "--version"], 
                               stdout=subprocess.PIPE, 
                               stderr=subprocess.PIPE,
                               text=True)
        if result.returncode == 0:
            print(f"✓ Ollama is installed: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        # If not in PATH, try using the full path
        try:
            if os.path.exists(OLLAMA_PATH):
                result = subprocess.run([OLLAMA_PATH, "--version"], 
                                       stdout=subprocess.PIPE, 
                                       stderr=subprocess.PIPE,
                                       text=True)
                if result.returncode == 0:
                    print(f"✓ Ollama is installed at {OLLAMA_PATH}: {result.stdout.strip()}")
                    return True
        except Exception:
            pass
    
    # Check if Ollama is running using tasklist
    try:
        result = subprocess.run(["tasklist", "/FI", "IMAGENAME eq ollama.exe"], 
                               stdout=subprocess.PIPE, 
                               stderr=subprocess.PIPE,
                               text=True)
        if "ollama.exe" in result.stdout:
            print("✓ Ollama is running but not in PATH")
            return True
    except Exception:
        pass
    
    print("✗ Ollama is not installed or not in PATH")
    return False

def install_ollama_instructions():
    """Provide instructions for installing Ollama"""
    system = platform.system().lower()
    
    print("\nOllama Installation Instructions:")
    print("--------------------------------")
    
    if system == "linux":
        print("Run the following command in your terminal:")
        print("curl -fsSL https://ollama.ai/install.sh | sh")
    elif system == "darwin":  # macOS
        print("Run the following command in your terminal:")
        print("curl -fsSL https://ollama.ai/install.sh | sh")
    elif system == "windows":
        print("Download the Windows installer from: https://ollama.ai/download")
    else:
        print("Visit https://ollama.ai for installation instructions for your platform")
    
    print("\nAfter installing Ollama, run this setup script again.")

def download_deepseek_model():
    """Download the DeepSeek model"""
    print("\nDownloading DeepSeek model (this may take a while depending on your internet speed)...")
    try:
        # Download the smaller model by default using the full path
        subprocess.check_call([OLLAMA_PATH, "pull", "deepseek-r1:1.5b"])
        print("✓ DeepSeek model downloaded successfully")
    except subprocess.CalledProcessError as e:
        print(f"Error: Failed to download DeepSeek model: {e}")
        print("Make sure Ollama is running and try again")
        sys.exit(1)

def create_templates_dir():
    """Create templates directory if it doesn't exist"""
    if not os.path.exists("templates"):
        os.makedirs("templates")
        print("✓ Created templates directory")

def main():
    """Main setup function"""
    print("Setting up DeepSeek Flask Backend...")
    
    check_python_version()
    create_templates_dir()
    install_dependencies()
    
    if not check_ollama():
        install_ollama_instructions()
        sys.exit(1)
    
    # Ask if user wants to download the model now
    download_choice = input("\nDo you want to download the DeepSeek model now? (y/n): ").lower()
    if download_choice == 'y':
        download_deepseek_model()
    
    print("\nSetup completed successfully!")
    print("To run the application, use: python app.py")
    print("Then open your browser and go to: http://localhost:5000")

if __name__ == "__main__":
    main() 