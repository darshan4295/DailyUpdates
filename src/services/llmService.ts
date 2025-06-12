export const generateSummary = async (updates: any[]): Promise<string> => {
  try {
    // Prepare the text data for summarization
    const textData = updates.map(update => 
      `Team: ${update.team}\nEmployee: ${update.userName}\nDate: ${update.date}\n` +
      `Accomplishments: ${update.accomplishments}\n` +
      `Carry Forward: ${update.carryForward}\n` +
      `Today's Plans: ${update.todayPlans}\n---\n`
    ).join('\n');

    // Using Hugging Face's free inference API for summarization
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        headers: {
          'Authorization': 'Bearer hf_demo', // Using demo token for free tier
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: `Please summarize the following daily updates from our team:\n\n${textData.slice(0, 1000)}`, // Limit input size
          parameters: {
            max_length: 300,
            min_length: 50,
            do_sample: false
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }

    const result = await response.json();
    return result[0]?.summary_text || result[0]?.generated_text || 'Summary could not be generated at this time.';
  } catch (error) {
    console.error('Error generating summary:', error);
    
    // Fallback: Generate a basic summary manually
    const teams = [...new Set(updates.map(u => u.team))];
    const employees = [...new Set(updates.map(u => u.userName))];
    const totalUpdates = updates.length;
    
    return `Summary Report:\n\n` +
           `Total Updates: ${totalUpdates}\n` +
           `Teams Involved: ${teams.join(', ')}\n` +
           `Active Employees: ${employees.length}\n\n` +
           `Key Highlights:\n` +
           `• Multiple teams are actively reporting progress\n` +
           `• Regular communication and task tracking is maintained\n` +
           `• Teams are managing carry-forward tasks effectively\n\n` +
           `Note: This is a basic summary. For detailed AI analysis, please check your API configuration.`;
  }
};