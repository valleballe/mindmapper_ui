let personData;

document.addEventListener('DOMContentLoaded', function() {
    // Function to get URL parameter
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Fetch data from data.json
    fetch('data/trends_twitter_20_p3.json')
        .then(response => response.json())
        .then(data => {

            console.log(data)
            const item = getUrlParameter('item');
            const condition = getUrlParameter('condition');

            if (data) {
                // Set profile picture and name
                //document.getElementById('profile_pic').src = personData.profile_pic;
                document.getElementById('profile_name').textContent = "Behavioral Patterns";
                document.getElementById('profile_description').textContent = "The patterns below were identified by having a large language model observe your verbal behavior, generate hypotheses and evaluate evidence.";

                // Generate trends
                const trendsContainer = document.getElementById('trends');
                //trendsContainer.innerHTML = ''; // Clear previous content
                var item_index = 0;

                // Sort data by the number of evidence
                data.sort((a, b) => b.evidence.length - a.evidence.length);

                for (const key in data) {

                    console.log(key)

                    // Increase count of items
                    item_index = item_index + 1;
                    
                    // Check if item param is used
                    if (item){
                        if (item != item_index){
                            continue;
                        }
                    }

                    if (data.hasOwnProperty(key)) {
                        const trend = data[key];

                        // Create trend element
                        const trendElement = document.createElement('div');
                        trendElement.className = 'trend';

                        // Create title element
                        const titleElement = document.createElement('div');
                        titleElement.className = 'trend-title';
                        titleElement.textContent = trend.hypothesis;

                        // Create subtitle element
                        const subtitleElement = document.createElement('div');
                        subtitleElement.className = 'trend-subtitle';
                        subtitleElement.textContent = 'Pattern ' + item_index;

                        // Create implications container
                        const implicationsContainer = document.createElement('div');
                        implicationsContainer.className = 'trend-implications';

                        // Add implication items
                        if (condition == 1){
                            trend.implications.forEach(implicationText => {
                                const implicationsIcon = document.createElement('button');
                                implicationsIcon.className = 'trend-icon';
                                implicationsIcon.innerHTML = '<span class="material-icons" style="color:RGB(213, 24, 24);">error</span>';
                                const implicationsIconText = document.createElement('div');
                                implicationsIconText.style = 'color:RGB(213, 24, 24); margin: 0 10px 0 10px';
                                implicationsIconText.innerHTML = implicationText;
                                
                                implicationsIcon.appendChild(implicationsIconText);
                                implicationsContainer.appendChild(implicationsIcon);
                            });
                        }

                        // Create content element
                        const contentElement = document.createElement('div');
                        contentElement.className = 'trend-content';
                        contentElement.textContent = trend.content;

                        // Create options element
                        const optionsContainer = document.createElement('div');
                        optionsContainer.className = 'trend-options';

                        // Create evidence element
                        const evidenceIcon = document.createElement('button');
                        evidenceIcon.className = 'trend-icon';
                        evidenceIcon.innerHTML = '<span class="material-icons" style="color:RGB(122, 150, 185);">bookmark</span>';
                        const evidenceIconText = document.createElement('div');
                        evidenceIconText.style = 'color:RGB(85, 110, 141);';
                        evidenceIconText.innerHTML = 'Hide Evidence';

                        // Create expand button element
                        const buttonElement = document.createElement('button');
                        buttonElement.className = 'trend-button';
                        buttonElement.innerHTML = '<span class="material-icons">expand_more</span>';
                        optionsContainer.appendChild(evidenceIcon);
                        evidenceIcon.appendChild(evidenceIconText);
                        optionsContainer.appendChild(buttonElement);

                        // Create evidence container
                        const evidenceContainer = document.createElement('div');
                        evidenceContainer.className = 'evidence';

                        // Add evidence items
                        trend.evidence.forEach(evidenceText => {

                            if (evidenceText == ""){
                                return
                            }
                            const evidenceItem = document.createElement('div');
                            evidenceItem.className = 'evidence-item';
                            
                            evidenceText.split("\n").forEach(evidenceMessage => {
                                // Split the message by parts using regex to match label and value
                                const parts = evidenceMessage.match(/(?:ID|User|Other Speaker): [^:]+/g);
                                
                                if (parts) {
                                    parts.forEach(part => {
                                        // Only process parts other than the ID
                                        if (!part.startsWith("ID:")) {
                                            const evidenceSubItem = document.createElement('div');
                                            evidenceSubItem.textContent = part.trim(); // Trim any extra spaces
                                            evidenceItem.appendChild(evidenceSubItem);
                                        }
                                    });
                                    evidenceContainer.appendChild(evidenceItem);
                                }
                            });
                        
                        });

                        // Toggle evidence visibility
                        optionsContainer.addEventListener('click', function() {
                            if (evidenceContainer.style.display === 'none' || evidenceContainer.style.display === '') {
                                evidenceContainer.style.display = 'block';
                                evidenceIconText.innerHTML = "Hide Evidence"
                                buttonElement.innerHTML = '<span class="material-icons">expand_less</span>';
                            } else {
                                evidenceContainer.style.display = 'none';
                                evidenceIconText.innerHTML = "Show Evidence"
                                buttonElement.innerHTML = '<span class="material-icons">expand_more</span>';
                            }
                        });

                        // Append content, button, and evidence to trend element
                        trendElement.appendChild(subtitleElement);
                        trendElement.appendChild(titleElement);
                        trendElement.appendChild(contentElement);
                        trendElement.appendChild(implicationsContainer);
                        trendElement.appendChild(optionsContainer);
                        trendElement.appendChild(evidenceContainer);

                        // Append trend element to trends container
                        trendsContainer.appendChild(trendElement);

                    }
                }
            } else {
                // Handle case where personId is not found
                document.getElementById('profile_name').textContent = 'Person not found';
            }
        })
        .catch(error => console.error('Error loading data:', error));
});

// Call OpenAI with model
/*document.getElementById('chatbot-button').addEventListener('click', async function() {

    // Get system message
    let input = document.getElementById('input').innerHTML;
    
    // Call openai
    let result = await callOpenAI(input, personData.trends);
    document.getElementById('result').innerHTML = result;

});*/