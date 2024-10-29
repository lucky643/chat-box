const socket = io();  // Establishes a WebSocket connection using Socket.io
const sendButton = document.querySelector("#sendButton");  // Send button for sending messages
const input = document.querySelector(".input");  // Input field for the chat message
const messages = document.querySelector("#messages");  // Message container to display messages
const submit = document.querySelector(".submit");  // Submit button for setting the username
const overlay = document.querySelector("#overlay");  // Overlay to hide/display the login form
const nameInput = document.querySelector("#nameInput");  // Input field for the username
const Gbutton = document.querySelectorAll(".Gbutton");  // Placeholder for multiple buttons (currently unused)

// Function to manage the chatbox functionality
const chatbox = () => {
     try {
        // Event listener for the "Submit" button (to set the username)
          submit.addEventListener("click", () => {
               if (nameInput.value.trim().length != 0) {
                    // Emit 'nameset' event to server when username is submitted
                    socket.emit("nameset", nameInput.value.trim());

                    // Server confirms that the name has been set
                    socket.on("namesetdone", (name) => {
                         document.querySelector(".username").textContent = name;
                    });

                    // Listen for 'activeUsers' event to display number of active users
                    socket.on('activeUsers', (activeUsers) => {
                         document.querySelector('.active').textContent = activeUsers;
                    });

                overlay.style.display = "none";  // Hide the login overlay when name is set
               } else {
                    alert("Name cannot be empty!");
               }
          });

        // Event listener to trigger the send button when "Enter" key is pressed
          input.addEventListener("keydown", (e) => {
               if (e.key === 'Enter') {
                    sendButton.click();
               }
          });

        // Event listener for typing detection, emits 'typing' event to server
          input.addEventListener("input", () => {
               socket.emit('typing', nameInput.value);
          });

        // Listen for 'typing' event from the server and display typing notification
          socket.on('typing', (typingUser) => {
               if (typingUser) {
                    document.querySelector('.typing').textContent = `${typingUser} is typing...`;
               } else {
                    document.querySelector('.typing').textContent = '';
               }
               setTimeout(() => {
                    document.querySelector('.typing').textContent = '';
               }, 2000);
          });

        // Event listener for the send button to send the message
          sendButton.addEventListener("click", () => {
               if (input.value.trim().length != 0) {
                    // Send message to the server including the user's name and the message
                    socket.emit("sendmsg", [nameInput.value, input.value]);
                    input.value = '';  // Clear the input field after sending
               }
          });

        // Listen for 'receive' event to display incoming messages
          socket.on("receive", (msg) => {
               let myMsg = msg.id === socket.id;  // Check if the message was sent by the current user
               const container =
                    `<div class="flex ${myMsg ? 'justify-end' : 'justify-start'}">
                         <h1 class="font-bold w-fit ${myMsg ? 'bg-teal-500' : 'bg-blue-400'} px-2 py-1 rounded-br-lg mt-2">${msg.msg[1]}</h1>
                         <h4 class="text-white italic text-[10px] ">~${msg.msg[0]}</h4>
                    </div>`;
               
               messages.innerHTML += container;  // Add message to the message container
               messages.scrollTop = messages.scrollHeight;  // Scroll to the bottom of the messages
          });
     } catch (error) {
          console.error("An error occurred in the chatbox function:", error);
     }
};

// Function to navigate to the video chat page
const navigate = () => {
     try {
          window.location.href = "/video-chat";  // Redirect to video chat page
     } catch (error) {
          console.error("An error occurred during navigation:", error);
     }
};

chatbox();