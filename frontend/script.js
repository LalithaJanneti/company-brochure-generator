const API_BASE = "http://127.0.0.1:8000";

const urlInput = document.getElementById("companyUrl");
const generateButton = document.getElementById("generateBtn");
const loadingMessage = document.getElementById("loading");
const errorMessage = document.getElementById("error");
const resultSection = document.getElementById("result");
const brochureContent = document.getElementById("brochureContent");
const statusBadge = document.getElementById("statusBadge");
const statusText = document.getElementById("statusText");
const refreshStatusBtn = document.getElementById("refreshStatusBtn");
const ollamaOfflineBanner = document.getElementById("ollamaOfflineBanner");
const retryOllamaBtn = document.getElementById("retryOllamaBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

// Event Listeners
generateButton.addEventListener("click", generateBrochure);
urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        generateBrochure();
    }
});

refreshStatusBtn.addEventListener("click", checkHealth);
if (retryOllamaBtn) {
    retryOllamaBtn.addEventListener("click", checkHealth);
}

// Example buttons
document.querySelectorAll(".example-tag").forEach(btn => {
    btn.addEventListener("click", () => {
        urlInput.value = btn.dataset.url;
        urlInput.focus();
    });
});

// Copy button
if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
        const text = brochureContent.textContent;
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "✅ Copied!";
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch {
            showError("Could not copy to clipboard.");
        }
    });
}

// Download button
if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
        const text = brochureContent.textContent;
        if (!text) return;
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        const domain = (urlInput.value || "company")
            .replace(/https?:\/\//, "")
            .replace(/[^a-zA-Z0-9]/g, "_")
            .toLowerCase();
        link.href = URL.createObjectURL(blob);
        link.download = `${domain}_brochure.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
    });
}

// Check Backend & Ollama health
async function checkHealth() {
    statusBadge.className = "status-badge connecting";
    statusText.textContent = "Checking Ollama...";

    try {
        const response = await fetch(`${API_BASE}/health`, { cache: "no-store" });
        if (!response.ok) throw new Error("Backend not responding");
        
        const data = await response.json();
        if (data.ollama_running) {
            statusBadge.className = "status-badge online";
            const modelName = data.models && data.models.length > 0 ? data.models[0] : "llama3.2";
            statusText.textContent = `Ollama Connected (${modelName})`;
            if (ollamaOfflineBanner) ollamaOfflineBanner.classList.add("hidden");
        } else {
            statusBadge.className = "status-badge offline";
            statusText.textContent = "Ollama Offline";
            if (ollamaOfflineBanner) ollamaOfflineBanner.classList.remove("hidden");
        }
    } catch {
        statusBadge.className = "status-badge offline";
        statusText.textContent = "Backend Disconnected";
        if (ollamaOfflineBanner) ollamaOfflineBanner.classList.remove("hidden");
    }
}

// Generate Brochure
async function generateBrochure() {
    let url = urlInput.value.trim();

    if (!url) {
        showError("Please enter a company website URL.");
        return;
    }

    hideError();
    loadingMessage.classList.remove("hidden");
    resultSection.classList.add("hidden");
    generateButton.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Something went wrong.");
        }

        brochureContent.textContent = data.brochure;
        resultSection.classList.remove("hidden");

        // Scroll smoothly to result
        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (error) {
        showError(error.message);
        // Refresh health status in case Ollama went down
        checkHealth();
    } finally {
        loadingMessage.classList.add("hidden");
        generateButton.disabled = false;
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

function hideError() {
    errorMessage.classList.add("hidden");
    errorMessage.textContent = "";
}

// Check health on page load
checkHealth();