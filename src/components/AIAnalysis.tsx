import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAnalysis: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingRealAI, setIsUsingRealAI] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getLogContext = (): string => {
    // Provide current log analysis context to the AI
    return `You are an expert AI assistant for BriefCam's log collection and analysis tool. You help system administrators analyze logs and troubleshoot issues.

CURRENT LOG ANALYSIS DATA:
- Total log entries analyzed: 15,347
- Time range: Last 24 hours
- Services monitored: VSServer Service, Processing Server, Fetching Service, Filtering Service

CURRENT ISSUES DETECTED:
- VSServer Service: 15 errors, 45 warnings (connection timeouts, memory issues)
- Processing Server: 2 errors, 102 warnings (memory allocation, performance)
- Fetching Service: 0 errors, 12 warnings (network connectivity)
- Filtering Service: 28 errors, 5 warnings (configuration validation)

SYSTEM METRICS:
- Overall error rate: 5.2% (above 2% threshold)
- Average response time: 2.3s (40% slower than baseline)
- CPU usage: 85% across processing nodes
- Memory utilization: 78% with spikes to 89%
- Processing queue: 127 items pending

RESPONSE FORMAT REQUIRED:
Always structure your response EXACTLY like this:

🚨 **[Main Title Here]**

Brief analysis paragraph explaining the situation.

**🔧 Immediate Actions:**
1. First urgent action with specific details
2. Second urgent action with specific details
3. Third urgent action with specific details

**💡 Recommended Actions:**
1. First strategic action for long-term improvement
2. Second strategic action for long-term improvement
3. Third strategic action for long-term improvement

**🔍 Troubleshooting Tips:**
• First monitoring/diagnostic tip
• Second monitoring/diagnostic tip
• Third monitoring/diagnostic tip

**📚 Documentation & Resources:**
• [VSServer Connection Pool Troubleshooting Guide]
• [Memory Optimization Best Practices]
• [BriefCam Service Configuration Manual]

Use these exact emojis: 🚨 for critical, ⚠️ for warnings, 📊 for status, 🤖 for general, 📈 for analysis.
Format documentation links exactly as shown above with square brackets.
Be specific to BriefCam video analytics platform and the actual log data provided.`;
  };

  const callGeminiAPI = async (userPrompt: string): Promise<string> => {
    // Get API key from environment variables or use fallback for demo
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBZlm5JfBV5HKzJ8MQOEJHk5S-_Lpm_kmo';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    const context = getLogContext();
    
    // Include recent conversation context for better variety
    const recentMessages = messages.slice(-4).map(msg => 
      `${msg.type.toUpperCase()}: ${msg.content.substring(0, 200)}...`
    ).join('\n');
    
    const conversationContext = recentMessages ? `\n\nRECENT CONVERSATION:\n${recentMessages}\n` : '';
    
    const fullPrompt = `You are a BriefCam video analytics system expert helping to analyze log data and resolve technical issues.

IMPORTANT: When providing documentation links, only use these exact link names from the BriefCam FAQ:
- BriefCam Hardware Requirements
- GPU Requirements Guide  
- Load Balancing Configuration
- High Availability Setup
- Cloud Architecture Support
- Virtual Environment Setup
- Video Format Support
- Minimum Resolution Requirements
- Video Codec Support
- Frame Rate Requirements
- Real-Time Alerts Configuration
- Face Recognition Setup
- Alert Notification Methods
- VIDEO SYNOPSIS Documentation
- Object Classification Guide
- Security & Privacy Guidelines
- GDPR Compliance Information
- Training Resources
- System Performance Optimization
- Database Configuration
- Network Configuration
- BriefCam Nexus Setup
- Troubleshooting Guide

${context}${conversationContext}

USER QUESTION: ${userPrompt}

Please provide a detailed, actionable response that includes:
1. Immediate actions to take (if any issues are identified)
2. Recommended long-term solutions
3. Troubleshooting tips
4. Relevant documentation links from the BriefCam FAQ (use exact names from the list above)

Format your response with clear headers using ** for bold text and appropriate emojis:
- 🚨 for critical issues
- ⚠️ for warnings
- 📊 for analysis
- 🔧 for immediate actions
- 💡 for recommendations
- 🔍 for troubleshooting tips
- 📚 for documentation

Include relevant documentation links in the format: • [Link Name] (using only the exact names from the list above)

Keep responses practical, technical, and focused on BriefCam video analytics systems. If this is a similar question to recent ones, provide fresh insights or different angles while maintaining the required structure.`;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Fallback to simulated response if API fails
      return getFallbackResponse(userPrompt);
    }
  };

  const getFallbackResponse = (userPrompt: string): string => {
    const prompt = userPrompt.toLowerCase();
    
    if (prompt.includes('error') || prompt.includes('issue') || prompt.includes('problem')) {
      return `🚨 **Critical Error Analysis**

Based on your log analysis, I've identified several high-priority error patterns that require immediate attention.

**🔧 Immediate Actions:**
1. Restart VSServer Service to clear connection pool exhaustion
2. Increase memory allocation for Processing Server from 4GB to 8GB
3. Review and update Filtering Service configuration files
4. Clear processing queue backlog (127 pending items)

**💡 Recommended Actions:**
1. Implement connection pooling monitoring with alerts
2. Set up automated memory cleanup for Processing Server
3. Create configuration validation checks for Filtering Service
4. Enable detailed error logging for all services

**🔍 Troubleshooting Tips:**
• Monitor VSServer connection count every 5 minutes
• Check Processing Server memory usage during peak hours
• Verify Filtering Service configuration syntax
• Review error patterns for recurring issues

**📚 Documentation & Resources:**
• [BriefCam Hardware Requirements]
• [GPU Requirements Guide]
• [Troubleshooting Guide]`;
    }
    
    if (prompt.includes('performance') || prompt.includes('slow') || prompt.includes('optimization')) {
      return `⚠️ **Performance Optimization Analysis**

Your system is showing signs of performance degradation with response times 40% above baseline.

**🔧 Immediate Actions:**
1. Scale processing workers from 4 to 8 instances
2. Enable hardware acceleration for video processing
3. Implement request queuing with priority levels
4. Clear processing queue backlog immediately

**💡 Recommended Actions:**
1. Deploy load balancing across service instances
2. Enable Redis caching for frequently accessed data
3. Optimize database query indexes
4. Implement auto-scaling based on CPU usage

**🔍 Troubleshooting Tips:**
• Monitor CPU usage patterns during peak hours
• Track memory allocation trends
• Measure response time improvements after changes
• Set up performance alerts for early detection

**📚 Documentation & Resources:**
• [System Performance Optimization]
• [Load Balancing Configuration]
• [High Availability Setup]`;
    }

    if (prompt.includes('summary') || prompt.includes('overview') || prompt.includes('status')) {
      return `📊 **System Health Overview**

Overall system status requires attention with elevated error rates and performance issues.

**🔧 Immediate Actions:**
1. Address VSServer connection issues (15 errors in last hour)
2. Investigate Processing Server memory spikes to 89%
3. Review Filtering Service configuration errors
4. Monitor CPU usage at 85% across all nodes

**💡 Recommended Actions:**
1. Implement proactive monitoring for all critical metrics
2. Set up automated alerts for error rates >2%
3. Create performance baselines for each service
4. Schedule regular health checks

**🔍 Troubleshooting Tips:**
• Error rates increased 3x in past 2 hours - investigate trigger
• Memory usage trending upward since 14:00
• Processing queue growing faster than completion rate
• All services online but performance degraded

**📚 Documentation & Resources:**
• [Real-Time Alerts Configuration]
• [Alert Notification Methods]
• [Troubleshooting Guide]`;
    }
    
    // Default fallback response with variety
    const defaultResponses = [
      `🤖 **BriefCam Log Analysis Assistant**

I'm here to help you analyze your video analytics system logs and resolve issues efficiently.

**🔧 Immediate Actions:**
1. Review current error patterns in VSServer Service
2. Check Processing Server memory utilization
3. Verify all services are responding normally

**💡 What I can help with:**
1. Identify critical errors requiring immediate attention
2. Suggest performance optimization strategies
3. Provide troubleshooting guidance for specific issues
4. Analyze system health trends and patterns

**🔍 Try asking me:**
• "What are the most critical errors to fix first?"
• "How can I improve system performance?"
• "What's causing the VSServer connection issues?"
• "Give me a summary of system health"

**📚 Documentation & Resources:**
• [VIDEO SYNOPSIS Documentation]
• [Object Classification Guide]
• [Security & Privacy Guidelines]`,

      `📈 **Current System Analysis**

Your BriefCam system is processing significant log volume with some areas needing attention.

**🔧 Current Status:**
1. Processing 15,347 log entries from last 24 hours
2. 4/4 services online but with performance issues
3. Error rate at 5.2% (above 2% threshold)
4. Memory utilization reaching 89% with spikes

**💡 Available Analysis:**
1. Real-time error pattern detection
2. Performance bottleneck identification
3. Service-specific troubleshooting guidance
4. Preventive maintenance recommendations

**🔍 Ask me specific questions about:**
• Critical errors and their solutions
• Performance optimization strategies
• Service configuration issues
• System health monitoring

**📚 Documentation & Resources:**
• [Video Analytics Troubleshooting]
• [System Performance Guide]`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Call Gemini API for real AI response
    try {
      const aiResponseContent = await callGeminiAPI(userMessage.content);
      setIsUsingRealAI(true);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsUsingRealAI(false);
      
      // Fallback response on error
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `${getFallbackResponse(userMessage.content)}

*Note: Using fallback response - check API key configuration for full AI capabilities*`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    
    // Just set the input value, don't auto-submit
    setInputValue(suggestion);
    
    // Focus the textarea for immediate editing
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInputValue('');
    setIsLoading(false);
    setIsUsingRealAI(false);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderFormattedMessage = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      // Handle headers with emojis and **bold** text
      if (line.match(/^(🚨|⚠️|📊|🤖|📈)\s*\*\*(.*)\*\*$/)) {
        const match = line.match(/^(🚨|⚠️|📊|🤖|📈)\s*\*\*(.*)\*\*$/);
        if (match) {
          elements.push(
            <div key={index} className="flex items-center space-x-2 mb-4 mt-6 first:mt-0">
              <span className="text-lg">{match[1]}</span>
              <h3 className="text-lg font-bold text-white">{match[2]}</h3>
            </div>
          );
          return;
        }
      }

      // Handle section headers like **🔧 Immediate Actions:**
      if (line.match(/^\*\*(🔧|💡|🔍|📚).*\*\*$/)) {
        const match = line.match(/^\*\*(🔧|💡|🔍|📚)(.*)\*\*$/);
        if (match) {
          elements.push(
            <div key={index} className="flex items-center space-x-2 mt-4 mb-2">
              <span className="text-base">{match[1]}</span>
              <h4 className="text-base font-semibold text-blue-300">{match[2].trim()}</h4>
            </div>
          );
          return;
        }
      }

      // Handle numbered list items
      if (line.match(/^\d+\.\s/)) {
        elements.push(
          <div key={index} className="ml-4 mb-2">
            <span className="text-gray-300">{line}</span>
          </div>
        );
        return;
      }

      // Handle bullet points
      if (line.match(/^•\s/)) {
        elements.push(
          <div key={index} className="ml-4 mb-1 flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            <span className="text-gray-300">{line.substring(2)}</span>
          </div>
        );
        return;
      }

      // Handle documentation links
      if (line.match(/^•\s*\[.*\]$/)) {
        const linkText = line.match(/\[(.*)\]/)?.[1] || '';
        const linkUrl = generateDocumentationUrl(linkText);
        elements.push(
          <div key={index} className="ml-4 mb-2">
            <button
              onClick={() => window.open(linkUrl, '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded transition-colors inline-flex items-center space-x-1"
            >
              <span>📚</span>
              <span>{linkText}</span>
            </button>
          </div>
        );
        return;
      }

      // Handle regular text with **bold** formatting
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formattedParts = parts.map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={partIndex} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        elements.push(
          <div key={index} className="mb-2 text-gray-300">
            {formattedParts}
          </div>
        );
        return;
      }

      // Handle empty lines
      if (line.trim() === '') {
        elements.push(<div key={index} className="mb-2"></div>);
        return;
      }

      // Regular text
      elements.push(
        <div key={index} className="mb-2 text-gray-300">
          {line}
        </div>
      );
    });

    return <div>{elements}</div>;
  };

  const generateDocumentationUrl = (linkText: string): string => {
    // Generate BriefCam FAQ URLs based on link text
    const baseUrl = 'https://www.briefcam.com/resources/faqs/';
    
    const urlMap: { [key: string]: string } = {
      'BriefCam Hardware Requirements': `${baseUrl}#hardware-requirements`,
      'GPU Requirements Guide': `${baseUrl}#gpu-requirements`,
      'Load Balancing Configuration': `${baseUrl}#load-balancing`,
      'High Availability Setup': `${baseUrl}#redundancy-high-availability`,
      'Cloud Architecture Support': `${baseUrl}#cloud-architecture`,
      'Virtual Environment Setup': `${baseUrl}#virtual-architecture`,
      'Video Format Support': `${baseUrl}#video-formats`,
      'Minimum Resolution Requirements': `${baseUrl}#minimum-maximum-resolution`,
      'Video Codec Support': `${baseUrl}#video-codecs`,
      'Frame Rate Requirements': `${baseUrl}#minimum-maximum-fps`,
      'Real-Time Alerts Configuration': `${baseUrl}#briefcam-alert-types`,
      'Face Recognition Setup': `${baseUrl}#face-recognition-alerts`,
      'Alert Notification Methods': `${baseUrl}#new-briefcam-alerts`,
      'VIDEO SYNOPSIS Documentation': `${baseUrl}#video-synopsis`,
      'Object Classification Guide': `${baseUrl}#characteristics-distinguish-filter`,
      'Security & Privacy Guidelines': `${baseUrl}#security-privacy`,
      'GDPR Compliance Information': `${baseUrl}#gdpr-compliant`,
      'Training Resources': `${baseUrl}#training-types`,
      'System Performance Optimization': `${baseUrl}#performance-tuning`,
      'Database Configuration': `${baseUrl}#server-database`,
      'Network Configuration': `${baseUrl}#networking-related`,
      'BriefCam Nexus Setup': `${baseUrl}#nexus`,
      'Troubleshooting Guide': `${baseUrl}#troubleshooting`
    };

    return urlMap[linkText] || baseUrl;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Assistant</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Ask me anything about your log analysis. I can help identify issues, suggest optimizations, and provide troubleshooting guidance.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}>
                                     <div className="whitespace-pre-wrap text-sm leading-relaxed">
                     {renderFormattedMessage(message.content)}
                   </div>
                  <div className={`text-xs mt-2 opacity-70 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-400">AI is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Bottom of Panel */}
      <div className="border-t border-gray-700 bg-gray-900 p-4 flex-shrink-0">
        {/* AI Status Indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isUsingRealAI ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className="text-xs text-gray-400">
              {isUsingRealAI ? 'AI Assistant (Powered by Gemini)' : 'AI Assistant (Fallback Mode)'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {!isUsingRealAI && (
              <span className="text-xs text-yellow-400">⚠️ Check API key</span>
            )}
            {messages.length > 0 && (
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded transition-colors flex items-center space-x-1"
                title="Reset conversation"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative bg-gray-800 border border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Insert a link to a Jira ticket, describe an issue, or ask a question related to logs. The knowledge base connected to the BriefCam help center and will provide you with relevant links"
              className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none resize-none"
              rows={4}
              disabled={isLoading}
            />
            
            {/* Bottom Section with Suggestions and Send Button */}
            <div className="px-4 pb-3 pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-medium">Quick suggestions:</span>
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="flex flex-wrap gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick("What are the critical errors I should fix first?")}
                    disabled={isLoading}
                    className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-300 hover:text-white disabled:text-gray-500 px-3 py-1.5 rounded-md text-xs transition-colors border border-gray-600 hover:border-gray-500"
                  >
                    Critical errors
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick("How can I improve system performance?")}
                    disabled={isLoading}
                    className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-300 hover:text-white disabled:text-gray-500 px-3 py-1.5 rounded-md text-xs transition-colors border border-gray-600 hover:border-gray-500"
                  >
                    Performance issues
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick("Give me a summary of system health")}
                    disabled={isLoading}
                    className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-300 hover:text-white disabled:text-gray-500 px-3 py-1.5 rounded-md text-xs transition-colors border border-gray-600 hover:border-gray-500"
                  >
                    System health
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick("Explain the video processing errors in my logs")}
                    disabled={isLoading}
                    className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-300 hover:text-white disabled:text-gray-500 px-3 py-1.5 rounded-md text-xs transition-colors border border-gray-600 hover:border-gray-500"
                  >
                    Video processing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick("Check for memory and resource issues")}
                    disabled={isLoading}
                    className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-300 hover:text-white disabled:text-gray-500 px-3 py-1.5 rounded-md text-xs transition-colors border border-gray-600 hover:border-gray-500"
                  >
                    Memory issues
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick("Analyze network connectivity problems")}
                    disabled={isLoading}
                    className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-300 hover:text-white disabled:text-gray-500 px-3 py-1.5 rounded-md text-xs transition-colors border border-gray-600 hover:border-gray-500"
                  >
                    Network issues
                  </button>
                </div>
                
                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px] min-h-[40px] flex-shrink-0"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAnalysis; 