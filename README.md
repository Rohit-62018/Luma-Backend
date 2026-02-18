# Luma – AI Text Assistant Backend

Luma is an AI-powered text assistant backend that processes user text input and generates intelligent responses — similar to ChatGPT, but focused on text-based interaction only.

 This project is built for learning, experimentation, and backend AI integration practice.

 ---
 
# Features

-   Text-based AI conversation
-	LLAM Model API integration
-   MongoDB database support
-   Text-to-Speech (TTS) service integration (Python-based)
-	REST API built with Express.js
-	Microservice-friendly architecture
	
---

## Tech Stack

-	Node.js
-	Express.js
-	MongoDB
-	LLAM Model API
-	Python (for TTS Service)
	
---

## ⚙️ Installation & Setup

### 1. Clone the Repository
``` bash
    git clone https://github.com/your-username/luma-backend.git
    cd luma-backend
```
### 2. Install Dependencies
``` bash
    npm install
``` 
### 3. Setup Environment Variables
``` bash
   JWT_SECRET=my-supper-30-secret
   EMAIL=example@gmail.com
   EMAIL_PASS=wveb xfct exxx ...
   OPENROUTER_API_KEY=gsk_1n8qt1YjumeVrCTC...
   OPENROUTER_BASE_URL=https://example.ai/api/v1
```
### 4. Start the Server
 ``` bash
    node index.js
```

---

## How It Works

1.	The user enters a message in the React frontend.
2.	The React app sends the message to the Express backend through a REST API request.
3.	The backend forwards the message to the LLAM Model API to generate an AI response.
4.	As soon as the AI response is generated, the backend immediately calls the Python-based TTS microservice.
5.	The TTS service converts the AI response into audio.
6.	The backend stores the conversation in MongoDB.
7.	Finally, the backend sends both the text response (and audio output, if enabled) back to the React frontend.
8.	The frontend displays the text response and can optionally play the generated audio.
