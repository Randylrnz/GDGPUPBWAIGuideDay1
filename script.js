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
                completionSection.innerHTML = atob('PHAgY2xhc3M9J3N1Y2Nlc3MtbWVzc2FnZSc+WW91J3JlIGFsbCBzZXQhPC9wPjxwIGNsYXNzPSdjbGFpbS1jb2RlJz5Vc2UgdGhpcyBjb2RlIHRvIGNsYWltIHlvdXIgY2VydGlmaWNhdGU6PGJyPjxzdHJvbmc+QldBSURBWTAxPC9zdHJvbmc+PC9wPjxhIGhyZWY9J2h0dHBzOi8vY2VydC5nZGdwdXAub3JnL3N1cnZleS9id2FpMjAyNi1kYXkxJyB0YXJnZXQ9J19ibGFuaycgY2xhc3M9J2NlcnQtYnRuJyBpZD0nY2VydEJ0bic+R2V0IENlcnRpZmljYXRlPC9hPg==');
                completionSection.classList.remove('hidden');
                // Use scrollIntoView to show the completion section smoothly
                completionSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 600); // Wait for progress bar animation
        }
    }
});
