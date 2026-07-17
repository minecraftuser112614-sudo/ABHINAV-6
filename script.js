const ADMIN_PASSWORD = 'abhinav22456';
let tools = JSON.parse(localStorage.getItem('tools')) || [];
let socialLinks = JSON.parse(localStorage.getItem('socialLinks')) || {
    instagram: '#',
    discord: '#'
};
let toDeleteFileIndex = null;

// ===== CANVAS ANIMATION (Solo Leveling Background) =====
function initCanvas() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(111, 66, 193, ${0.3 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== HOME PAGE FUNCTIONS =====
function goToUser() {
    window.location.href = 'user.html';
}

function promptAdminPassword() {
    const password = prompt('🔐 Enter Admin Password:');
    if (password === ADMIN_PASSWORD) {
        window.location.href = 'admin.html';
    } else if (password !== null) {
        alert('❌ Incorrect Password!');
    }
}

// ===== DASHBOARD FUNCTIONS =====
function loadTools() {
    const toolsGrid = document.getElementById('toolsGrid');
    const emptyState = document.getElementById('emptyState');

    if (!toolsGrid) return;

    if (tools.length === 0) {
        toolsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    toolsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    toolsGrid.innerHTML = '';

    tools.forEach((tool, index) => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.innerHTML = `
            <div class="tool-header">
                <div class="tool-name">📦 ${tool.name}</div>
                <div class="tool-date">${new Date(tool.date).toLocaleDateString()}</div>
            </div>
            <div class="tool-description">${tool.description}</div>
            <div class="tool-actions">
                <button class="tool-actions button btn-download" onclick="downloadFile(${index})">⬇️ Download</button>
                <button class="tool-actions button btn-readme" onclick="viewReadme(${index})">📖 README</button>
            </div>
        `;
        toolsGrid.appendChild(toolCard);
    });
}

function filterTools() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    const filtered = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm)
    );

    const toolsGrid = document.getElementById('toolsGrid');
    toolsGrid.innerHTML = '';

    if (filtered.length === 0) {
        toolsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No tools found</div>';
        return;
    }

    filtered.forEach((tool, index) => {
        const toolIndex = tools.indexOf(tool);
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.innerHTML = `
            <div class="tool-header">
                <div class="tool-name">📦 ${tool.name}</div>
                <div class="tool-date">${new Date(tool.date).toLocaleDateString()}</div>
            </div>
            <div class="tool-description">${tool.description}</div>
            <div class="tool-actions">
                <button class="tool-actions button btn-download" onclick="downloadFile(${toolIndex})">⬇️ Download</button>
                <button class="tool-actions button btn-readme" onclick="viewReadme(${toolIndex})">📖 README</button>
            </div>
        `;
        toolsGrid.appendChild(toolCard);
    });
}

function sortTools(sortBy) {
    if (sortBy === 'name') {
        tools.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'date') {
        tools.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    loadTools();
    updateFilterButtons();
}

function updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

function downloadFile(index) {
    const tool = tools[index];
    if (!tool.fileData) {
        alert('File data not available');
        return;
    }
    const link = document.createElement('a');
    link.href = tool.fileData;
    link.download = tool.filename || tool.name;
    link.click();
}

function viewReadme(index) {
    const tool = tools[index];
    const modal = document.getElementById('readmeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = `📖 ${tool.name} - README`;
    modalBody.innerHTML = parseMarkdown(tool.readme || 'No README available');
    modal.style.display = 'block';
}

function closeReadmeModal() {
    document.getElementById('readmeModal').style.display = 'none';
}

function parseMarkdown(md) {
    return md
        .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
        .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
        .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

function goHome() {
    window.location.href = 'index.html';
}

window.onclick = function(event) {
    const modal = document.getElementById('readmeModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// ===== ADMIN FUNCTIONS =====
function showSection(sectionName) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName + 'Section').classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    if (sectionName === 'files') {
        loadFilesList();
    } else if (sectionName === 'readme') {
        loadReadmeList();
    } else if (sectionName === 'links') {
        loadLinks();
    }
}

function uploadFile() {
    const fileName = document.getElementById('fileName').value;
    const fileDescription = document.getElementById('fileDescription').value;
    const readmeContent = document.getElementById('readmeContent').value;
    const fileInput = document.getElementById('fileInput');
    const uploadStatus = document.getElementById('uploadStatus');

    if (!fileName || !fileDescription || !readmeContent || !fileInput.files[0]) {
        showStatus('uploadStatus', '❌ Please fill all fields and select a file', 'error');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const newTool = {
            name: fileName,
            description: fileDescription,
            readme: readmeContent,
            filename: file.name,
            fileData: e.target.result,
            date: new Date().toISOString()
        };

        tools.push(newTool);
        localStorage.setItem('tools', JSON.stringify(tools));

        showStatus('uploadStatus', '✅ File uploaded successfully!', 'success');
        document.getElementById('fileName').value = '';
        document.getElementById('fileDescription').value = '';
        document.getElementById('readmeContent').value = '';
        document.getElementById('fileInput').value = '';
    };

    reader.readAsArrayBuffer(file);
}

function showStatus(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `status-message ${type}`;
    setTimeout(() => {
        element.className = 'status-message';
    }, 4000);
}

function loadFilesList() {
    const filesList = document.getElementById('filesList');
    const emptyFiles = document.getElementById('emptyFiles');

    if (tools.length === 0) {
        filesList.style.display = 'none';
        emptyFiles.style.display = 'block';
        return;
    }

    filesList.style.display = 'grid';
    emptyFiles.style.display = 'none';
    filesList.innerHTML = '';

    tools.forEach((tool, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-header">
                <div class="file-name">📦 ${tool.name}</div>
                <div class="file-date">${new Date(tool.date).toLocaleDateString()}</div>
            </div>
            <div class="file-description">${tool.description}</div>
            <div class="file-actions">
                <button class="btn-del" onclick="openDeleteModal(${index})">🗑️ Delete</button>
            </div>
        `;
        filesList.appendChild(fileItem);
    });
}

function loadReadmeList() {
    const readmeList = document.getElementById('readmeList');
    const emptyReadme = document.getElementById('emptyReadme');

    if (tools.length === 0) {
        readmeList.style.display = 'none';
        emptyReadme.style.display = 'block';
        return;
    }

    readmeList.style.display = 'grid';
    emptyReadme.style.display = 'none';
    readmeList.innerHTML = '';

    tools.forEach((tool, index) => {
        const readmeItem = document.createElement('div');
        readmeItem.className = 'readme-item';
        readmeItem.innerHTML = `
            <div class="file-header">
                <div class="file-name">📝 ${tool.name}</div>
            </div>
            <div class="file-description" style="max-height: 100px; overflow: hidden;">${tool.readme}</div>
        `;
        readmeList.appendChild(readmeItem);
    });
}

function loadLinks() {
    document.getElementById('instagramLink').value = socialLinks.instagram || '';
    document.getElementById('discordLink').value = socialLinks.discord || '';
}

function updateLinks() {
    const instagram = document.getElementById('instagramLink').value;
    const discord = document.getElementById('discordLink').value;

    socialLinks = { instagram, discord };
    localStorage.setItem('socialLinks', JSON.stringify(socialLinks));

    showStatus('linksStatus', '✅ Social links updated successfully!', 'success');
}

function openDeleteModal(index) {
    toDeleteFileIndex = index;
    document.getElementById('deleteModal').style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    toDeleteFileIndex = null;
}

function confirmDelete() {
    if (toDeleteFileIndex !== null) {
        tools.splice(toDeleteFileIndex, 1);
        localStorage.setItem('tools', JSON.stringify(tools));
        closeDeleteModal();
        loadFilesList();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}

window.onclick = function(event) {
    const readmeModal = document.getElementById('readmeModal');
    const deleteModal = document.getElementById('deleteModal');

    if (readmeModal && event.target === readmeModal) {
        readmeModal.style.display = 'none';
    }
    if (deleteModal && event.target === deleteModal) {
        deleteModal.style.display = 'none';
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    loadTools();
    loadLinks();
});