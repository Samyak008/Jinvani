// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
   interface Thought {
     id: number;
     text: string;
     translation: string;
     source: string;
     reference: string;
   }

   const thoughtTextElement = document.getElementById('thoughtText');
   const translationElement = document.getElementById('translation');
   const sourceElement = document.getElementById('source');
   const okBtn = document.getElementById('okBtn');
   const closeBtn = document.getElementById('closeBtn');

   // Add loading animation initially
   thoughtTextElement?.classList.add('loading');
   translationElement?.classList.add('loading');

   // Listen for thought data from main process
   window.electronAPI.onDisplayThought((thought: Thought) => {
       displayThought(thought);
   });

   // Handle OK button click
   okBtn?.addEventListener('click', () => {
       acknowledgeAndClose();
   });

   // Handle close button click
   closeBtn?.addEventListener('click', () => {
       window.electronAPI.closePopup();
   });

   // Handle keyboard shortcuts
   document.addEventListener('keydown', (event) => {
       switch (event.key) {
           case 'Enter':
           case ' ': // Spacebar
               event.preventDefault();
               acknowledgeAndClose();
               break;
           case 'Escape':
               event.preventDefault();
               window.electronAPI.closePopup();
               break;
       }
   });

   function displayThought(thought: Thought | null) {
       // Remove loading animation
       thoughtTextElement?.classList.remove('loading');
       translationElement?.classList.remove('loading');

       if (thought) {
           // Display the thought text
           if (thoughtTextElement) {
               thoughtTextElement.textContent = thought.text;
           }

           // Display translation
           if (translationElement) {
               translationElement.textContent = thought.translation;
           }

           // Display source
           if (sourceElement) {
               sourceElement.textContent = `— ${thought.source} (${thought.reference})`;
           }

           // Add fade-in animation
           (document.querySelector('.popup-container') as HTMLElement | null)?.classList.add('fade-in');
       } else {
           // Handle error case
           if (thoughtTextElement) {
               thoughtTextElement.textContent = 'Unable to load thought. Please try again later.';
           }
           if (translationElement) {
               translationElement.textContent = '';
           }
           if (sourceElement) {
               sourceElement.textContent = '';
           }
       }
   }

   function acknowledgeAndClose() {
       // Add closing animation
       const container = document.querySelector('.popup-container') as HTMLElement | null;
       if (container) {
           container.style.transform = 'scale(0.8)';
           container.style.opacity = '0';
           container.style.transition = 'all 0.2s ease-out';
       }

       // Close after animation
       setTimeout(() => {
           window.electronAPI.closePopup();
       }, 200);
   }

   // Focus the window when loaded
   window.focus();

   // Auto-focus the OK button for keyboard accessibility
   setTimeout(() => {
       okBtn?.focus();
   }, 100);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
   .fade-in {
       animation: fadeIn 0.3s ease-out;
   }
   
   @keyframes fadeIn {
       from {
           opacity: 0;
           transform: scale(0.9);
       }
       to {
           opacity: 1;
           transform: scale(1);
       }
   }
   
   .popup-container {
       transition: all 0.2s ease-out;
   }
   
   /* Button focus styles */
   .ok-btn:focus,
   .close-btn:focus {
       outline: 2px solid #4facfe;
       outline-offset: 2px;
   }
`;
document.head.appendChild(style);