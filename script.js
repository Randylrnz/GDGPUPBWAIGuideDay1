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
            setTimeout(async () => {
                try {
                    const finalInput = document.getElementById('input6').value.trim().toUpperCase();
                    const pwUtf8 = new TextEncoder().encode(finalInput);
                    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);
                    const key = await crypto.subtle.importKey('raw', pwHash, 'AES-GCM', false, ['decrypt']);
                    
                    const hexStr = "43d194df993a8b40590784330493326ab4b7c0a3cc2f01954c4c46943b229fa89bdee7eab06f519916db92381cbfc230d5b804666361e1f27cc29820902c9d18658bd0774da83bfc4f819f6b141653fb11be85e9dd8db5f264f8144ee6efc4c093e1af06c80180e56864eda237aa9b14bebfdd572693dc15d5d23049ebc3e81644216087290c0d31d95224cc0fd0421783be69465b51fee03d668cd9d98c2b7723883d22da1b7caea0a153289570363934e9ff6345af68f1386b8d3dc45c98f67d166edc3c7ebda6b629f2d92bafbfe90ec9ad75327126edfb6f1fe7aee389952382d412843a6f800d6e3caaf249408c99fe4b4d12e8d25757cf66e789a8e49a1b890c17e4da42b6abd2a3d32b2d072f6c2b97ef5bbc";
                    const encryptedBytes = new Uint8Array(hexStr.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                    const iv = new Uint8Array(12);
                    
                    const decryptedBuffer = await crypto.subtle.decrypt(
                        { name: 'AES-GCM', iv: iv },
                        key,
                        encryptedBytes
                    );
                    const decryptedHtml = new TextDecoder().decode(decryptedBuffer);
                    
                    completionSection.innerHTML = decryptedHtml;
                    completionSection.classList.remove('hidden');
                    completionSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } catch (e) {
                    console.error("Decryption error");
                }
            }, 600); // Wait for progress bar animation
        }
    }
});
