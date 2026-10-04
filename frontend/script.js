
const API_BASE = "https://company-brochure-generator-n4up.onrender.com";

const urlInput = document.getElementById("companyUrl");
const generateButton = document.getElementById("generateBtn");
const loadingMessage = document.getElementById("loading");
const errorMessage = document.getElementById("error");
const resultSection = document.getElementById("result");
const brochureContent = document.getElementById("brochureContent");

const statusBadge = document.getElementById("statusBadge");
const statusText = document.getElementById("statusText");
const refreshStatusBtn = document.getElementById("refreshStatusBtn");

const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");


// Event Listeners
generateButton.addEventListener("click", generateBrochure);

urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        generateBrochure();
    }
});


// Refresh backend status
if (refreshStatusBtn) {
    refreshStatusBtn.addEventListener("click", checkHealth);
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

        const blob = new Blob(
            [text],
            {
                type: "text/plain;charset=utf-8"
            }
        );

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


// Check backend health
async function checkHealth() {

    if (!statusBadge || !statusText) return;

    statusBadge.className = "status-badge connecting";

    statusText.textContent = "Checking API...";

    try {

        const response = await fetch(
            `${API_BASE}/`,
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("Backend not responding");
        }

        const data = await response.json();

        statusBadge.className = "status-badge online";

        statusText.textContent = "API Connected";

    } catch {

        statusBadge.className = "status-badge offline";

        statusText.textContent = "API Offline";
    }
}


// Generate Brochure
async function generateBrochure() {

    const url = urlInput.value.trim();

    if (!url) {

        showError("Please enter a company website URL.");

        return;
    }

    hideError();

    loadingMessage.classList.remove("hidden");

    resultSection.classList.add("hidden");

    generateButton.disabled = true;

    try {

        const response = await fetch(
            `${API_BASE}/generate`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    url: url
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.detail || "Something went wrong."
            );
        }

        brochureContent.textContent = data.brochure;

        resultSection.classList.remove("hidden");

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {

        showError(
            error.message ||
            "Unable to generate brochure."
        );

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


// Check backend when page loads
checkHealth();
