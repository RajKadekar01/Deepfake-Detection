document.addEventListener('DOMContentLoaded', function() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const resultsContainer = document.getElementById('resultsContainer');
  const emptyState = document.getElementById('emptyState');
  
  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
  });
  
  // Highlight drop zone when item is dragged over it
  ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, highlight, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, unhighlight, false);
  });
  
  // Handle dropped files
  dropZone.addEventListener('drop', handleDrop, false);
  
  // Handle file selection
  fileInput.addEventListener('change', handleFiles, false);
  
  function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
  }
  
  function highlight() {
      dropZone.classList.add('border-primary', 'bg-indigo-50');
  }
  
  function unhighlight() {
      dropZone.classList.remove('border-primary', 'bg-indigo-50');
  }
  
  function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles({ target: { files } });
  }
  
  function handleFiles(e) {
      const files = e.target.files;
      if (files.length) {
          processFile(files[0]);
      }
  }
  
  function processFile(file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime'];
      if (!validTypes.includes(file.type)) {
          alert('Please upload a valid image or video file (JPG, PNG, MP4, MOV)');
          return;
      }
      
      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
          alert('File size exceeds 50MB limit');
          return;
      }
      
      // Show loading state
      emptyState.innerHTML = `
          <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <h4 class="text-lg font-medium text-gray-500 mb-2">Analyzing File</h4>
              <p class="text-gray-400">This may take a few moments...</p>
          </div>
      `;
      
      // Simulate API call with timeout
      setTimeout(() => {
          // Update UI with results
          updateResultsUI(file);
          
          // Show results and hide empty state
          resultsContainer.classList.remove('hidden');
          emptyState.classList.add('hidden');
      }, 3000);
  }
  
  function updateResultsUI(file) {
      // Mock data - in a real app, this would come from your Python backend
      const mockResults = {
          fileName: file.name,
          isFake: Math.random() > 0.7, // 30% chance of being fake
          confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
          fileType: file.type.includes('image') ? 'Image' : 'Video',
          fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          resolution: file.type.includes('image') ? '1920x1080' : '1280x720 @ 30fps',
          analysisTime: (Math.random() * 2 + 1.5).toFixed(1) + 's'
      };
      
      // Update DOM elements
      document.getElementById('fileName').textContent = mockResults.fileName;
      document.getElementById('fileType').textContent = mockResults.fileType;
      document.getElementById('fileSize').textContent = mockResults.fileSize;
      document.getElementById('resolution').textContent = mockResults.resolution;
      document.getElementById('analysisTime').textContent = mockResults.analysisTime;
      document.getElementById('confidenceValue').textContent = mockResults.confidence + '%';
      document.getElementById('confidenceBar').style.width = mockResults.confidence + '%';
      
      // Update result badge and explanation
      const resultBadge = document.getElementById('resultBadge');
      const resultExplanation = document.getElementById('resultExplanation');
      
      if (mockResults.isFake) {
          resultBadge.textContent = 'Deepfake';
          resultBadge.className = 'px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800';
          resultExplanation.textContent = 'Our analysis suggests this media has been manipulated with high confidence. Several indicators typical of deepfake generation were detected.';
      } else {
          resultBadge.textContent = 'Real';
          resultBadge.className = 'px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800';
          resultExplanation.textContent = 'Our analysis suggests this media is likely authentic with high confidence. No significant indicators of manipulation were detected.';
      }
  }
});