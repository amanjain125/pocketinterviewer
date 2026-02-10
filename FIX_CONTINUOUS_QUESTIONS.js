// FIX FOR PANEL INTERVIEWER - Continuous Questions
// Replace lines 247-254 in app/src/sections/PanelPage.tsx

// FIND THIS CODE (around line 247-254):
/*
      // If the current speaker was the interrupter or observer, switch back to lead
      if (currentSpeaker !== 'lead') {
        setTimeout(() => {
          setCurrentSpeaker('lead');
          // Generate a new question from the lead interviewer
          generateNewQuestion();
        }, 2000);
      }
*/

// REPLACE WITH THIS:

// Always generate next question after user finishes answering
setTimeout(() => {
    // If the current speaker was the interrupter or observer, switch back to lead first
    if (currentSpeaker !== 'lead') {
        setCurrentSpeaker('lead');
    }
    // Generate next question (works for all speakers now)
    generateNewQuestion();
}, 2000);

/*
EXPLANATION:
The original code only generated a NEW question when currentSpeaker !== 'lead'.
This meant after answering the lead interviewer, no new question appeared.

The fix moves the setTimeout OUTSIDE the if statement, so it ALWAYS runs.
Now every answer triggers a new question!
*/
