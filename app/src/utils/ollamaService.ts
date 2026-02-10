import type { InterviewFeedback } from "@/types";

const OLLAMA_API_URL = 'http://localhost:11434/api/generate'; // Default Ollama endpoint

interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_ctx?: number;
  };
}


export const analyzeAnswerWithOllama = async (
  question: string,
  answer: string,
  model: string = 'llama3.2:3b'  // Using llama3.2:3b which is efficient for conversation
): Promise<InterviewFeedback> => {
  try {
    const prompt = `
      You are an expert interview evaluator. Analyze the following answer to the interview question and provide detailed feedback.
      
      Question: ${question}
      Answer: ${answer}
      
      Please provide your evaluation in the following JSON format:
      {
        "overallScore": number between 0-100,
        "confidenceScore": number between 0-100,
        "communicationScore": number between 0-100,
        "technicalScore": number between 0-100,
        "strengths": array of 3 string strengths,
        "improvements": array of 3 string areas for improvement,
        "summary": string summary of the feedback,
        "weaknessRadar": {
          "clarity": number between 0-100,
          "structure": number between 0-100,
          "technicalDepth": number between 0-100,
          "confidence": number between 0-100,
          "relevance": number between 0-100
        }
      }
      
      Be constructive and specific in your feedback. Focus on how the candidate can improve their interview performance.
    `;

    const requestBody: OllamaRequest = {
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.4, // Lower temperature for more consistent evaluations
        top_p: 0.9,
        num_ctx: 4096,
      }
    };

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Parse the response to extract the feedback object
    const feedbackText = data.response || data.generated;

    // Extract JSON from the response (sometimes Ollama returns extra text)
    const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse feedback from Ollama response: ' + feedbackText);
    }

    const feedback: InterviewFeedback = JSON.parse(jsonMatch[0]);
    return feedback;
  } catch (error) {
    console.error('Error analyzing answer with Ollama:', error);
    
    // Return mock feedback in case of error
    return {
      overallScore: 75,
      confidenceScore: 70,
      communicationScore: 75,
      technicalScore: 70,
      strengths: [
        'Good attempt at answering',
        'Showed some understanding',
        'Structured response'
      ],
      improvements: [
        'Provide more specific examples',
        'Be more concise',
        'Focus on outcomes and results'
      ],
      summary: 'Your answer showed understanding of the topic but could benefit from more specific examples and clearer structure. Focus on demonstrating your skills with concrete examples.',
      weaknessRadar: {
        clarity: 70,
        structure: 65,
        technicalDepth: 60,
        confidence: 75,
        relevance: 70
      }
    };
  }
};

// Function to check if Ollama is available
export const checkOllamaConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    return response.ok;
  } catch (error) {
    console.error('Ollama connection failed:', error);
    return false;
  }
};

// Function to get available models
export const getAvailableModels = async (): Promise<string[]> => {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }
    
    const data = await response.json();
    return data.models?.map((model: any) => model.name) || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};