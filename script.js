document.addEventListener('DOMContentLoaded', () => {
    const topics = [
        { id: 1, keyword: 'DONE' },
        { id: 2, keyword: 'CLOUDS' },
        { id: 3, keyword: 'AILABU' },
        { id: 4, keyword: 'ARDUINAUR' },
        { id: 5, keyword: 'LASTNATO' }
    ];

    let completedCount = 0;

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const completionSection = document.getElementById('completionSection');

    topics.forEach(topic => {
        const inputField = document.getElementById(`input${topic.id}`);
        const topicItem = document.getElementById(`topic${topic.id}`);
        const checkbox = document.getElementById(`check${topic.id}`);

        inputField.addEventListener('input', (e) => {
            const val = e.target.value.trim().toUpperCase();
            if (val === topic.keyword) {
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
                completionSection.classList.remove('hidden');
                // Use scrollIntoView to show the completion section smoothly
                completionSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 600); // Wait for progress bar animation
        }
    }
});
