from flask import Flask, render_template, request, jsonify
import os
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4', 'mov'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    # Generate unique filename
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    try:
        file.save(filepath)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    # Here you would call your deepfake detection model
    # For now, we'll return mock data
    file_size = os.path.getsize(filepath)
    is_video = ext in {'mp4', 'mov'}
    
    # Mock analysis results
    result = {
        'filename': filename,
        'original_name': secure_filename(file.filename),
        'file_type': 'video' if is_video else 'image',
        'file_size': f"{file_size / (1024 * 1024):.1f} MB",
        'resolution': '1920x1080' if not is_video else '1280x720 @ 30fps',
        'is_fake': False,  # This would come from your model
        'confidence': 87.5,  # This would come from your model
        'analysis_time': 2.3,  # This would be measured
        'indicators': [
            {'name': 'Facial warping', 'present': False, 'confidence': 12.3},
            {'name': 'Inconsistent lighting', 'present': False, 'confidence': 8.7},
            {'name': 'Unnatural eye blinking', 'present': True, 'confidence': 65.2},
            {'name': 'Frequency artifacts', 'present': False, 'confidence': 15.8}
        ],
        'timestamp': datetime.now().isoformat()
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)