from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json
import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Initialize Groq client
groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# Simple file-based user storage for demonstration
USERS_FILE = 'users.json'
DREAMS_FILE = 'dreams.json'

def load_users():
    try:
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
        else:
            print(f"Users file not found at: {os.path.abspath(USERS_FILE)}")
        return {}
    except Exception as e:
        print(f"Error loading users file: {str(e)}")
        return {}

def save_users(users):
    try:
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f)
        print(f"Users saved successfully to: {os.path.abspath(USERS_FILE)}")
    except Exception as e:
        print(f"Error saving users file: {str(e)}")

def load_dreams():
    if os.path.exists(DREAMS_FILE):
        with open(DREAMS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_dreams(dreams):
    with open(DREAMS_FILE, 'w') as f:
        json.dump(dreams, f)

class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id

@login_manager.user_loader
def load_user(user_id):
    users = load_users()
    if user_id in users:
        return User(user_id)
    return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        users = load_users()
        email = request.form['email']
        if email in users:
            return 'Email already registered'
        
        users[email] = {
            'password': generate_password_hash(request.form['password']),
            'username': request.form['username']
        }
        save_users(users)
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        users = load_users()
        email = request.form['email']
        password = request.form['password']

        # Debug logging
        print(f"Login attempt for email: {email}")
        print(f"Users in database: {list(users.keys())}")
        
        if email not in users:
            print(f"Email {email} not found in users database")
            return render_template('login.html', error="Invalid email or password")
            
        stored_password_hash = users[email]['password']
        if check_password_hash(stored_password_hash, password):
            user = User(email)
            login_user(user)
            print(f"Successful login for {email}")
            return redirect(url_for('dashboard'))
        else:
            print(f"Password verification failed for {email}")
            return render_template('login.html', error="Invalid email or password")
            
    return render_template('login.html', error=None)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/dashboard')
@login_required
def dashboard():
    dreams = load_dreams()
    user_dreams = dreams.get(current_user.id, [])
    return render_template('dashboard.html', dreams=user_dreams)

@app.route('/interpret_dream', methods=['GET', 'POST'])
@login_required
def interpret_dream():
    if request.method == 'POST':
        try:
            # Get form data with validation
            dream_description = request.form.get('dream_description')
            if not dream_description:
                return jsonify({'error': 'Please share your dream before interpretation'}), 400

            emotion = request.form.get('emotion')
            if not emotion:
                return jsonify({'error': 'Please select how you felt in the dream'}), 400

            context = request.form.get('context', '')

            # Print debugging information
            print(f"Processing dream interpretation request:")
            print(f"Description: {dream_description}")
            print(f"Emotion: {emotion}")
            print(f"Context: {context}")

            # Prepare prompt for Groq AI with instructions for concise response
            prompt = f"""As a dream interpreter, provide a brief but insightful interpretation of this dream:
            Dream: {dream_description}
            Emotion: {emotion}
            Context: {context}
            
            Provide a concise interpretation (3-4 sentences) that flows naturally as a single paragraph. Address the dream's symbolism, emotional significance, and possible life connection without using numbers or bullet points. Keep the response meaningful yet poetic, fitting the mystical nature of dream interpretation."""

            try:
                # Get interpretation from Groq AI
                response = groq_client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": "You are an insightful dream interpreter who focuses on explaining the psychological meaning and symbolism behind dreams. For each dream: 1) Identify key symbols and their meanings 2) Explain what subconscious thoughts or emotions they represent 3) Connect them to the dreamer's current life situation. Be direct and clear, avoid storytelling or flowery language. Focus on 'why' they had this dream and what it reveals about their inner state."},
                        {"role": "user", "content": prompt}
                    ],
                    model="mixtral-8x7b-32768",
                    temperature=0.7,
                    max_tokens=200
                )
                
                interpretation = response.choices[0].message.content
                print(f"Received interpretation: {interpretation}")

            except Exception as groq_error:
                print(f"Groq API Error: {str(groq_error)}")
                return jsonify({'error': f'AI Service Error: {str(groq_error)}'}), 500

            # Save dream and interpretation
            try:
                dreams = load_dreams()
                if current_user.id not in dreams:
                    dreams[current_user.id] = []
                
                dreams[current_user.id].append({
                    'description': dream_description,
                    'emotion': emotion,
                    'context': context,
                    'interpretation': interpretation,
                    'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
                save_dreams(dreams)

            except Exception as save_error:
                print(f"Save Error: {str(save_error)}")
                # Still return interpretation even if save fails
                return jsonify({'interpretation': interpretation})

            return jsonify({'interpretation': interpretation})

        except Exception as e:
            print(f"General Error: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    return render_template('interpret_dream.html')

if __name__ == '__main__':
    app.run(debug=True)
