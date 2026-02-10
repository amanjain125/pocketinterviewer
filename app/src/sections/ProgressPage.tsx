import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Star,
  Clock,
  Mic,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';


export function ProgressPage() {
  const { navigateTo, progressData } = useAppState();
  const [expandedInterview, setExpandedInterview] = useState<string | null>(null);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      behavioral: 'Behavioral',
      technical: 'Technical',
      rapid_fire: 'Rapid Fire',
      situational: 'Situational',
      hr_basics: 'HR Basics',
    };
    return labels[type] || type;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'text-green-400 bg-green-500/20',
      medium: 'text-yellow-400 bg-yellow-500/20',
      hard: 'text-red-400 bg-red-500/20',
    };
    return colors[difficulty] || 'text-white bg-white/10';
  };

  return (
    <div className="min-h-screen bg-[#2B0B57] pt-24 pb-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigateTo('dashboard')}
            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl text-white font-display font-bold">Your Progress</h1>
            <p className="text-white/60">Track your interview journey</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card-violet p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FF4EC2]/20 rounded-xl flex items-center justify-center">
                <Mic className="w-5 h-5 text-[#FF4EC2]" />
              </div>
              <span className="text-white/60 text-sm">Total Interviews</span>
            </div>
            <p className="text-3xl text-white font-display font-bold">
              {progressData?.totalInterviews || 12}
            </p>
          </div>

          <div className="card-violet p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-white/60 text-sm">Avg Score</span>
            </div>
            <p className="text-3xl text-white font-display font-bold">
              {progressData?.recentSessions && progressData.recentSessions.length > 0 
                ? Math.round(progressData.recentSessions.reduce((acc: number, session: any) => acc + (session.score || 0), 0) / progressData.recentSessions.length)
                : 0}%
            </p>
          </div>

          <div className="card-violet p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-white/60 text-sm">Practice Time</span>
            </div>
            <p className="text-3xl text-white font-display font-bold">
              {progressData?.totalDuration || 45} <span className="text-lg text-white/50">min</span>
            </p>
          </div>
        </div>

        {/* Skill Performance Gauges */}
        <div className="card-violet p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Skill Performance</h3>
              <p className="text-white/50 text-sm">Real-time skill assessment</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.entries(progressData?.weaknessRadar || {}).map(([skill, value], _index) => {
              const skillLabels: Record<string, string> = {
                clarity: 'Clarity',
                structure: 'Structure',
                technicalDepth: 'Technical Depth',
                confidence: 'Confidence',
                relevance: 'Relevance'
              };
              
              const skillColors: Record<string, string> = {
                clarity: '#818cf8',
                structure: '#60a5fa',
                technicalDepth: '#34d399',
                confidence: '#fbbf24',
                relevance: '#f87171'
              };
              
              const label = skillLabels[skill] || skill;
              const color = skillColors[skill] || '#818cf8';
              
              return (
                <div key={skill} className="flex flex-col items-center">
                  <h4 className="text-white font-medium mb-3">{label}</h4>
                  
                  {/* Circular gauge visualization */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Background circle */}
                    <div className="absolute w-full h-full rounded-full border-4 border-gray-700"></div>
                    
                    {/* Progress circle */}
                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(Number(value) / 100) * 283}, 283`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    
                    {/* Value indicator */}
                    <div className="relative z-10 text-center">
                      <span className="text-lg font-bold text-white">{value}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interview History */}
        <div>
          <h2 className="text-xl text-white font-semibold mb-4">Interview History</h2>
          <div className="space-y-4">
            {(progressData?.recentSessions || []).map((interview: any) => {
              const isExpanded = expandedInterview === interview.id;

              return (
                <div key={interview.id || Math.random()} className="card-violet overflow-hidden">
                  {/* Summary Row */}
                  <button
                    onClick={() => setExpandedInterview(isExpanded ? null : interview.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getDifficultyColor(interview.difficulty || 'medium')}`}>
                        <span className="text-xl font-bold">{interview.score || 0}</span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-semibold">
                          {getTypeLabel(interview.config?.type || 'behavioral')} Interview
                        </h3>
                        <p className="text-white/50 text-sm">
                          {interview.date ? new Date(interview.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'Unknown date'} • {interview.duration || 0} min • {interview.config?.difficulty || 'medium'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round((interview.score || 0) / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                          />
                        ))}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-white/60" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/60" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-white/10 pt-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Scores */}
                        <div>
                          <h4 className="text-white font-semibold mb-3">Scores</h4>
                          <div className="space-y-3">
                            {[
                              { label: 'Overall', value: interview.feedback?.overallScore },
                              { label: 'Confidence', value: interview.feedback?.confidenceScore },
                              { label: 'Communication', value: interview.feedback?.communicationScore },
                              { label: 'Technical', value: interview.feedback?.technicalScore },
                            ].filter(score => score.value !== undefined).map((score) => (
                              <div key={score.label}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-white/60">{score.label}</span>
                                  <span className="text-white">{score.value}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-[#FF4EC2] to-[#ff8ad8] rounded-full"
                                    style={{ width: `${score.value}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Strengths & Improvements */}
                        <div>
                          <h4 className="text-white font-semibold mb-3">Strengths</h4>
                          <ul className="space-y-2 mb-4">
                            {(interview.feedback?.strengths || []).map((strength: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 text-green-400 text-sm">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                {strength}
                              </li>
                            ))}
                          </ul>

                          <h4 className="text-white font-semibold mb-3">Areas to Improve</h4>
                          <ul className="space-y-2">
                            {(interview.feedback?.improvements || []).map((improvement: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 text-orange-400 text-sm">
                                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="mt-4 p-4 bg-white/5 rounded-xl">
                        <p className="text-white/80 text-sm">{interview.feedback?.summary || 'No summary available'}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-4">
                        <Button 
                          variant="outline" 
                          className="btn-secondary text-sm"
                          onClick={async () => {
                            // Dynamically import jsPDF to avoid bundling issues
                            const { jsPDF } = await import('jspdf');
                            const doc = new jsPDF();

                            // Add title
                            doc.setFontSize(22);
                            doc.setTextColor(129, 140, 248); // Indigo color
                            doc.text('Interview Performance Report', 20, 20);

                            // Add interview details
                            doc.setFontSize(16);
                            doc.setTextColor(0, 0, 0); // Black
                            doc.text('Interview Details', 20, 40);

                            doc.setFontSize(12);
                            doc.text(`Type: ${(interview.config?.type || 'N/A').replace('_', ' ')}`, 20, 50);
                            doc.text(`Difficulty: ${interview.config?.difficulty || 'N/A'}`, 20, 58);
                            doc.text(`Date: ${interview.date ? new Date(interview.date).toLocaleDateString() : 'N/A'}`, 20, 66);
                            doc.text(`Duration: ${interview.duration || 0} minutes`, 20, 74);
                            doc.text(`Score: ${interview.score || 0}%`, 20, 82);

                            // Add scores section
                            let yPos = 95;
                            doc.setFontSize(16);
                            doc.text('Scores', 20, yPos);
                            yPos += 10;

                            doc.setFontSize(12);
                            doc.text(`Overall: ${interview.feedback?.overallScore || 0}%`, 20, yPos);
                            yPos += 8;
                            doc.text(`Confidence: ${interview.feedback?.confidenceScore || 0}%`, 20, yPos);
                            yPos += 8;
                            doc.text(`Communication: ${interview.feedback?.communicationScore || 0}%`, 20, yPos);
                            yPos += 8;
                            doc.text(`Technical: ${interview.feedback?.technicalScore || 0}%`, 20, yPos);
                            yPos += 15;

                            // Add strengths section
                            doc.setFontSize(16);
                            doc.text('Strengths', 20, yPos);
                            yPos += 10;

                            doc.setFontSize(12);
                            (interview.feedback?.strengths || []).forEach((strength: string) => {
                              if (yPos > 270) { // Check if we need a new page
                                doc.addPage();
                                yPos = 20;
                              }
                              doc.text(`• ${strength}`, 20, yPos);
                              yPos += 8;
                            });
                            yPos += 10;

                            // Add areas for improvement section
                            doc.setFontSize(16);
                            doc.text('Areas for Improvement', 20, yPos);
                            yPos += 10;

                            doc.setFontSize(12);
                            (interview.feedback?.improvements || []).forEach((improvement: string) => {
                              if (yPos > 270) { // Check if we need a new page
                                doc.addPage();
                                yPos = 20;
                              }
                              doc.text(`• ${improvement}`, 20, yPos);
                              yPos += 8;
                            });
                            yPos += 10;

                            // Add summary
                            doc.setFontSize(16);
                            doc.text('Summary', 20, yPos);
                            yPos += 10;

                            doc.setFontSize(12);
                            const summaryText = interview.feedback?.summary || 'No summary available';
                            const summaryLines = doc.splitTextToSize(summaryText, 170);
                            summaryLines.forEach((line: string) => {
                              if (yPos > 270) { // Check if we need a new page
                                doc.addPage();
                                yPos = 20;
                              }
                              doc.text(line, 20, yPos);
                              yPos += 8;
                            });
                            yPos += 10;

                            // Add skill breakdown
                            doc.setFontSize(16);
                            doc.text('Skill Breakdown', 20, yPos);
                            yPos += 10;

                            doc.setFontSize(12);
                            doc.text(`Clarity: ${interview.feedback?.weaknessRadar?.clarity || 0}%`, 20, yPos);
                            yPos += 8;
                            doc.text(`Structure: ${interview.feedback?.weaknessRadar?.structure || 0}%`, 20, yPos);
                            yPos += 8;
                            doc.text(`Technical Depth: ${interview.feedback?.weaknessRadar?.technicalDepth || 0}%`, 20, yPos);
                            yPos += 8;
                            doc.text(`Confidence: ${interview.feedback?.weaknessRadar?.confidence || 0}%`, 20, yPos);
                            yPos += 8;
                            doc.text(`Relevance: ${interview.feedback?.weaknessRadar?.relevance || 0}%`, 20, yPos);

                            // Save the PDF
                            doc.save(`interview-report-${interview.id || Date.now()}.pdf`);
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Report
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
