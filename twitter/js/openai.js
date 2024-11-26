async function callOpenAI(input, patterns) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const promptFile = `../prompt.txt`;
  const openaiKey = `../openai_key.txt`;

  const bearer = `Bearer`;
  var prompt = await fetchTxtFile(promptFile);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", bearer);
  
  console.log(prompt)

  // Replace content of prompt with sentence
  console.log(prompt)

  const instructions = `
  # List of your behavioral patterns identified
  ${JSON.stringify(patterns)}
  
  # Instructions
  Given your behavioral patterns above you return the following json:
  {
      trend_ids: ["", ""] # a list of the trend ids used to predict the response
      predicted_response:"", # your predicted response as a direct quote based on the behavioral patterns to the user input.
  }
  `;
  console.log(instructions);


  const data = {
    "model": "gpt-4o",
    "messages": [
      {
        "role":"system",
        "content":instructions
      },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": input
                    }
                ]
            }
        ],
        "temperature": 0,
        "max_tokens": 2048,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "response_format": {
            "type": "json_object"
        }
    };

  const config = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  };

  console.log(config)

  const response = await fetch(apiUrl, config);
  const result = await response.json();
  const resultContent = result.choices[0].message.content;

  console.log(resultContent)

  return resultContent;
}

// Function to fetch the content of the prompt file
async function fetchTxtFile(filename) {
    const response = await fetch(filename);
    if (!response.ok) {
      throw new Error('Failed to load txt file.');
    }
    const text = await response.text();
    return text;
  }

