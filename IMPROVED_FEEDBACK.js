// IMPROVED OLLAMA FEEDBACK GENERATION
// Copy this function to replace endPanelInterview in PanelPage.tsx (starting at line 296)

const endPanelInterview = async () => {
    setIsProcessing(true);

    console.log('=== STARTING FEEDBACK GENERATION ===');
    console.log('Interview history:', interviewHistory);
    console.log('Number of Q&A pairs:', interviewHistory.length);
    console.log('Interruptions:', interruptions.length);
    console.log('Final transcript:', finalTranscript);

    try {
        // Build detailed prompt with actual Q&A pairs
        const qaText = interviewHistory.map((item, idx) =>
            `Question ${idx + 1}: ${item.question}\nAnswer ${idx + 1}: ${item.answer || 'No answer provided'}`
        ).join('\n\n');

        const feedbackPrompt = `You are an expert interview coach analyzing a panel interview.

INTERVIEW TRANSCRIPT:
${qaText}

Additional context:
- Number of interruptions from panel: ${interruptions.length}
- Most recent answer: ${finalTranscript || 'No recent answer'}

Analyze this interview performance based on the ACTUAL answers provided above. Be specific and reference what the candidate actually said.

Respond with ONLY valid JSON (no markdown, no extra text):
{
  "overallScore": <number 60-95>,
  "confidenceScore": <number based on answer quality>,
  "communicationScore": <number based on clarity>,
  "technicalScore": <number based on depth>,
  "strengths": ["specific strength from answers", "another strength"],
  "improvements": ["specific improvement needed", "another improvement"],
  "summary": "2-3 sentences mentioning specific things they said",
  "weaknessRadar": {
    "clarity": <number 60-95>,
    "structure": <number 60-95>,
    "technicalDepth": <number 60-95>,
    "confidence": <number 60-95>,
    "relevance": <number 60-95>
  },
  "interviewerFeedback": {
    "lead": "feedback about their main answers",
    "interrupter": "feedback about handling pressure",
    "observer": "feedback about details provided"
  }
}`;

        console.log('📤 Sending request to Ollama at http://localhost:11434/api/generate');
        console.log('Prompt preview:', feedbackPrompt.substring(0, 200) + '...');

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2:3b',
                prompt: feedbackPrompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                    num_predict: 500
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📥 Ollama response received:', data);

        // Extract and parse JSON from response
        try {
            let jsonMatch = data.response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsedFeedback = JSON.parse(jsonMatch[0]);
                console.log('✅ Successfully parsed AI feedback:', parsedFeedback);
                setFeedback(parsedFeedback);
                setInterviewPhase('feedback');
            } else {
                console.warn('⚠️ No JSON found in Ollama response');
                console.log('Raw response:', data.response);
                throw new Error('No JSON in response');
            }
        } catch (parseError) {
            console.error('❌ Error parsing feedback JSON:', parseError);
            console.error('Raw Ollama response:', data.response);

            throw new Error('Failed to parse Ollama response');
        }
    } catch (error) {
        console.error('❌ Error generating feedback:', error);

        const isConnectionError = error.message && (
            error.message.includes('fetch') ||
            error.message.includes('Failed to fetch') ||
            error.message.includes('ECONNREFUSED')
        );

        // Show helpful error message in feedback
        setFeedback({
            overallScore: 0,
            confidenceScore: 0,
            communicationScore: 0,
            technicalScore: 0,
            strengths: ["Interview completed"],
            improvements: isConnectionError
                ? ["⚠️ Start Ollama to get AI-powered feedback. Run: 'ollama serve' in a terminal"]
                : ["Check console for error details"],
            summary: isConnectionError
                ? "⚠️ OLLAMA NOT RUNNING - To get real AI feedback: 1) Install Ollama from ollama.ai, 2) Run 'ollama pull llama3.2:3b', 3) Run 'ollama serve', 4) Redo the interview"
                : `⚠️ Ollama Error: ${error.message}. Check browser console for details.`,
            weaknessRadar: {
                clarity: 0,
                structure: 0,
                technicalDepth: 0,
                confidence: 0,
                relevance: 0
            },
            interviewerFeedback: {
                lead: "❌ AI feedback unavailable - see summary for instructions",
                interrupter: "❌ AI feedback unavailable - see summary for instructions",
                observer: "❌ AI feedback unavailable - see summary for instructions"
            }
        });
        setInterviewPhase('feedback');
    }

    setIsProcessing(false);
};
