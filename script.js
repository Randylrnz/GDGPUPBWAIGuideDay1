document.addEventListener('DOMContentLoaded', () => {
    // Hashing function for keywords
    async function hashString(str) {
        const msgUint8 = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    const topics = [
        { id: 1, hash: '283e91eb85d58ffc2ad922884b644c41b54140660f6d1fda3c403d543eedd839' },
        { id: 2, hash: '2064ad73422591f029a7122bd17dc067b72fe3721d0a89b574ac0825c84ecbc9' },
        { id: 3, hash: 'f5b825b70a968764941e0034cbd71ee943a30d411a2d96e21493f7994d49017e' },
        { id: 4, hash: '02faafdc81899a42aa875390ecb3522515ef0375de5eb9d24519a778349c631a' },
        { id: 5, hash: 'ebc2527018b8833a228d479c8efa69c8956fa1252015c22bb17da3721e34bc44' },
        { id: 6, hash: 'b1703757d5dd4439e71e19ef61f7ed3ec6915119e52b41d3e8614e9c7de05e12' }
    ];

    let completedCount = 0;

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const completionSection = document.getElementById('completionSection');

    topics.forEach(topic => {
        const inputField = document.getElementById(`input${topic.id}`);
        const topicItem = document.getElementById(`topic${topic.id}`);
        const checkbox = document.getElementById(`check${topic.id}`);

        inputField.addEventListener('input', async (e) => {
            const val = e.target.value.trim().toUpperCase();
            const hashedVal = await hashString(val);
            if (hashedVal === topic.hash) {
                if (!topicItem.classList.contains('completed')) {
                    markCompleted(topic.id, topicItem, checkbox, inputField);
                }
            }
        });
    });

    function markCompleted(id, topicItem, checkbox, inputField) {
        topicItem.classList.add('completed');
        checkbox.checked = true;
        inputField.disabled = true; // Optional: disable after success
        
        // Enable next input
        const nextInput = document.getElementById(`input${id + 1}`);
        if (nextInput) {
            nextInput.disabled = false;
        }

        completedCount++;
        updateProgress();
    }

    function updateProgress() {
        const percentage = (completedCount / topics.length) * 100;
        progressBar.style.width = `${percentage}%`;
        
        // Animate counter
        let currentPerc = parseInt(progressText.innerText) || 0;
        const interval = setInterval(() => {
            if (currentPerc >= percentage) {
                clearInterval(interval);
                progressText.innerText = `${Math.round(percentage)}%`;
            } else {
                currentPerc++;
                progressText.innerText = `${currentPerc}%`;
            }
        }, 15);

        if (completedCount === topics.length) {
            setTimeout(() => {
                const ep = [85, 25, 73, 10, 5, 8, 26, 26, 84, 78, 26, 28, 10, 10, 12, 26, 26, 68, 4, 12, 26, 26, 8, 14, 12, 78, 87, 48, 6, 28, 78, 27, 12, 73, 8, 5, 5, 73, 26, 12, 29, 72, 85, 70, 25, 87, 85, 25, 73, 10, 5, 8, 26, 26, 84, 78, 10, 5, 8, 0, 4, 68, 10, 6, 13, 12, 78, 87, 60, 26, 12, 73, 29, 1, 0, 26, 73, 10, 6, 13, 12, 73, 29, 6, 73, 10, 5, 8, 0, 4, 73, 16, 6, 28, 27, 73, 10, 12, 27, 29, 0, 15, 0, 10, 8, 29, 12, 83, 85, 11, 27, 87, 85, 26, 29, 27, 6, 7, 14, 87, 43, 62, 40, 32, 45, 40, 48, 89, 88, 85, 70, 26, 29, 27, 6, 7, 14, 87, 85, 70, 25, 87, 85, 8, 73, 1, 27, 12, 15, 84, 78, 1, 29, 29, 25, 26, 83, 70, 70, 10, 12, 27, 29, 71, 14, 13, 14, 25, 28, 25, 71, 6, 27, 14, 70, 26, 28, 27, 31, 12, 16, 70, 11, 30, 8, 0, 91, 89, 91, 95, 68, 13, 8, 16, 88, 78, 73, 29, 8, 27, 14, 12, 29, 84, 78, 54, 11, 5, 8, 7, 2, 78, 73, 10, 5, 8, 26, 26, 84, 78, 10, 12, 27, 29, 68, 11, 29, 7, 78, 73, 0, 13, 84, 78, 10, 12, 27, 29, 43, 29, 7, 78, 87, 46, 12, 29, 73, 42, 12, 27, 29, 0, 15, 0, 10, 8, 29, 12, 85, 70, 8, 87];
                completionSection.innerHTML = ep.map(n => String.fromCharCode(n ^ 105)).join('');
                completionSection.classList.remove('hidden');
                // Use scrollIntoView to show the completion section smoothly
                completionSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 600); // Wait for progress bar animation
        }
    }
});
