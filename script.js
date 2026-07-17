const ADMIN_PASSWORD = 'abhinav22456';
let tools = JSON.parse(localStorage.getItem('tools')) || [];
let socialLinks = JSON.parse(localStorage.getItem('socialLinks')) || {
    instagram: '#',
    discord: '#'
};
let toDeleteFileIndex = null;
let toEditFileIndex = null;
let updateCheckInterval = null;
let githubUploadToken = '';
let githubUploadRepo = '';

// ===== REAL-TIME UPDATE CHECK =====
function startRealTimeUpdates() {
    updateCheckInterval = setInterval(() => {
        const latestTools = JSON.parse(localStorage.getItem('tools')) || [];
        
        if (JSON.stringify(latestTools) !== JSON.stringify(tools)) {
            tools = latestTools;
            loadTools();
        }
    }, 2000);
}

function stopRealTimeUpdates() {
    if (updateCheckInterval) {
        clearInterval(updateCheckInterval);
    }
}

// ===== OPTIMIZED CANVAS ANIMATION =====
function initCanvas() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 40;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
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

    let animationFrameId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        if (Math.random() > 0.5) {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(111, 66, 193, ${0.2 * (1 - distance / 120)})`;
                        ctx.lineWidth = 0.3;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
    };
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
        toolCard.style.animation = `slideInCard 0.4s ease-out ${index * 0.05}s both`;
        
        const fileSize = tool.size ? formatFileSize(tool.size) : 'N/A';
        
        let actionButtons = `
            <button class="tool-actions button btn-readme" onclick="viewReadme(${index})" style="flex: 1;">📖 README</button>
        `;
        
        if (tool.source === 'github') {
            actionButtons += `<button class="tool-actions button btn-download" onclick="downloadFromGithub(${index})" style="flex: 1;">⬇️ Download</button>`;
        } else if (tool.source === 'local' && tool.fileData) {
            actionButtons += `<button class="tool-actions button btn-download" onclick="downloadFile(${index})" style="flex: 1;">⬇️ Download</button>`;
        } else if (tool.source === 'github-repo') {
            actionButtons += `<button class="tool-actions button btn-download" onclick="downloadFromGithubRepo(${index})" style="flex: 1;">⬇️ Download</button>`;
        }
        
        toolCard.innerHTML = `
            <div class="tool-header">
                <div class="tool-name">📦 ${tool.name}</div>
                <div class="tool-date">${new Date(tool.date).toLocaleDateString()}</div>
            </div>
            <div class="tool-description">${tool.description}</div>
            <div class="tool-source" style="font-size: 0.75em; color: var(--text-secondary); margin: 8px 0;">
                📊 ${fileSize} • 📍 ${tool.source === 'github' ? '🐙 From GitHub (Small)' : tool.source === 'github-repo' ? '🐙 From GitHub (Large)' : '💾 Direct Upload'}
            </div>
            <div class="tool-actions" style="gap: 10px;">
                ${actionButtons}
            </div>
        `;
        toolsGrid.appendChild(toolCard);
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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
        toolsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); animation: fadeIn 0.3s ease;">🔍 No tools found</div>';
        return;
    }

    filtered.forEach((tool, index) => {
        const toolIndex = tools.indexOf(tool);
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.style.animation = `slideInCard 0.3s ease-out ${index * 0.05}s both`;
        
        const fileSize = tool.size ? formatFileSize(tool.size) : 'N/A';
        
        let actionButtons = `
            <button class="tool-actions button btn-readme" onclick="viewReadme(${toolIndex})" style="flex: 1;">📖 README</button>
        `;
        
        if (tool.source === 'github') {
            actionButtons += `<button class="tool-actions button btn-download" onclick="downloadFromGithub(${toolIndex})" style="flex: 1;">⬇️ Download</button>`;
        } else if (tool.source === 'local' && tool.fileData) {
            actionButtons += `<button class="tool-actions button btn-download" onclick="downloadFile(${toolIndex})" style="flex: 1;">⬇️ Download</button>`;
        } else if (tool.source === 'github-repo') {
            actionButtons += `<button class="tool-actions button btn-download" onclick="downloadFromGithubRepo(${toolIndex})" style="flex: 1;">⬇️ Download</button>`;
        }
        
        toolCard.innerHTML = `
            <div class="tool-header">
                <div class="tool-name">📦 ${tool.name}</div>
                <div class="tool-date">${new Date(tool.date).toLocaleDateString()}</div>
            </div>
            <div class="tool-description">${tool.description}</div>
            <div class="tool-source" style="font-size: 0.75em; color: var(--text-secondary); margin: 8px 0;">
                📊 ${fileSize} • 📍 ${tool.source === 'github' ? '🐙 From GitHub (Small)' : tool.source === 'github-repo' ? '🐙 From GitHub (Large)' : '💾 Direct Upload'}
            </div>
            <div class="tool-actions" style="gap: 10px;">
                ${actionButtons}
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
        alert('❌ File data not available');
        return;
    }
    const link = document.createElement('a');
    link.href = tool.fileData;
    link.download = tool.filename || tool.name;
    link.click();
}

async function downloadFromGithub(index) {
    const tool = tools[index];
    try {
        showStatus('uploadStatus', '⏳ Downloading from GitHub...', 'info');
        window.open(tool.downloadUrl || tool.rawUrl, '_blank');
        showStatus('uploadStatus', '✅ Download started!', 'success');
    } catch (error) {
        alert('❌ Error downloading file: ' + error.message);
    }
}

async function downloadFromGithubRepo(index) {
    const tool = tools[index];
    try {
        showStatus('uploadStatus', '⏳ Downloading from GitHub...', 'info');
        
        // Create download link
        const downloadUrl = `https://github.com/${tool.owner}/${tool.repo}/raw/${tool.branch}/${tool.filePath}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = tool.filename || tool.name;
        link.click();
        
        showStatus('uploadStatus', '✅ Download started!', 'success');
    } catch (error) {
        alert('❌ Error downloading file: ' + error.message);
    }
}

function viewReadme(index) {
    const tool = tools[index];
    const modal = document.getElementById('readmeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = `📖 ${tool.name} - README`;
    modalBody.innerHTML = parseMarkdown(tool.readme || 'No README available');
    modal.style.display = 'block';
    modal.style.animation = 'fadeIn 0.3s ease';
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
    stopRealTimeUpdates();
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
    const maxSize = 5 * 1024 * 1024; // 5MB limit for local storage

    if (file.size > maxSize) {
        showStatus('uploadStatus', `❌ File too large! Max 5MB for direct upload. Use GitHub upload for larger files (up to 100MB)`, 'error');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const newTool = {
            name: fileName,
            description: fileDescription,
            readme: readmeContent,
            filename: file.name,
            fileData: e.target.result,
            date: new Date().toISOString(),
            source: 'local',
            size: file.size
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

// ===== GITHUB LARGE FILE UPLOAD =====
function setupGithubUpload() {
    const token = document.getElementById('githubUploadToken').value;
    const repo = document.getElementById('githubUploadRepo').value;

    if (!token || !repo) {
        showStatus('githubUploadStatus', '❌ Please enter GitHub Token and Repo (owner/repo)', 'error');
        return;
    }

    githubUploadToken = token;
    githubUploadRepo = repo;
    showStatus('githubUploadStatus', '✅ GitHub setup saved! Now upload files.', 'success');
}

async function uploadLargeFileToGithub() {
    if (!githubUploadToken || !githubUploadRepo) {
        showStatus('githubUploadStatus', '❌ Please setup GitHub first', 'error');
        return;
    }

    const fileName = document.getElementById('githubLargeFileName').value;
    const filePath = document.getElementById('githubLargeFilePath').value;
    const fileDescription = document.getElementById('githubLargeDescription').value;
    const readme = document.getElementById('githubLargeReadme').value;
    const fileInput = document.getElementById('githubLargeFileInput');

    if (!fileName || !filePath || !fileDescription || !readme || !fileInput.files[0]) {
        showStatus('githubUploadStatus', '❌ Please fill all fields and select a file', 'error');
        return;
    }

    const file = fileInput.files[0];
    showStatus('githubUploadStatus', `⏳ Uploading ${file.name} (${formatFileSize(file.size)})...`, 'info');

    try {
        const fileContent = await fileToBase64(file);
        const [owner, repo] = githubUploadRepo.split('/');

        const uploadPath = `${filePath}/${file.name}`;
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${uploadPath}`;

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubUploadToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Upload ${file.name}`,
                content: fileContent.split(',')[1]
            })
        });

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        const data = await response.json();

        const newTool = {
            name: fileName,
            description: fileDescription,
            readme: readme,
            filename: file.name,
            date: new Date().toISOString(),
            source: 'github-repo',
            size: file.size,
            owner: owner,
            repo: repo,
            filePath: uploadPath,
            branch: 'main'
        };

        tools.push(newTool);
        localStorage.setItem('tools', JSON.stringify(tools));

        showStatus('githubUploadStatus', `✅ File uploaded successfully! (${formatFileSize(file.size)})`, 'success');
        document.getElementById('githubLargeFileName').value = '';
        document.getElementById('githubLargeFilePath').value = '';
        document.getElementById('githubLargeDescription').value = '';
        document.getElementById('githubLargeReadme').value = '';
        document.getElementById('githubLargeFileInput').value = '';
    } catch (error) {
        showStatus('githubUploadStatus', `❌ Error: ${error.message}`, 'error');
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ===== GITHUB SMALL FILE IMPORT =====
async function uploadFromGitHub() {
    const token = document.getElementById('githubToken').value;
    const repoUrl = document.getElementById('repoUrl').value;
    const filePath = document.getElementById('filePath').value;
    const fileName = document.getElementById('githubFileName').value;
    const description = document.getElementById('githubDescription').value;
    const readme = document.getElementById('githubReadme').value;

    if (!token || !repoUrl || !filePath || !fileName || !description || !readme) {
        showStatus('githubStatus', '❌ Please fill all fields', 'error');
        return;
    }

    try {
        showStatus('githubStatus', '⏳ Downloading file from GitHub...', 'info');
        
        let owner, repo;
        if (repoUrl.includes('github.com')) {
            const parts = repoUrl.replace('https://github.com/', '').replace('http://github.com/', '').split('/');
            owner = parts[0];
            repo = parts[1].replace('.git', '');
        } else {
            const parts = repoUrl.split('/');
            owner = parts[0];
            repo = parts[1];
        }

        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3.raw'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status} - File not found`);
        }

        const fileBlob = await response.blob();
        const reader = new FileReader();

        reader.onload = function(e) {
            const newTool = {
                name: fileName,
                description: description,
                readme: readme,
                filename: filePath.split('/').pop(),
                fileData: e.target.result,
                date: new Date().toISOString(),
                source: 'github',
                size: fileBlob.size,
                repoUrl: `https://github.com/${owner}/${repo}`,
                filePath: filePath
            };

            tools.push(newTool);
            localStorage.setItem('tools', JSON.stringify(tools));

            showStatus('githubStatus', '✅ File imported from GitHub successfully!', 'success');
            document.getElementById('githubToken').value = '';
            document.getElementById('repoUrl').value = '';
            document.getElementById('filePath').value = '';
            document.getElementById('githubFileName').value = '';
            document.getElementById('githubDescription').value = '';
            document.getElementById('githubReadme').value = '';
        };

        reader.readAsArrayBuffer(fileBlob);
    } catch (error) {
        showStatus('githubStatus', `❌ Error: ${error.message}`, 'error');
    }
}

function showStatus(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = message;
    element.className = `status-message ${type}`;
    
    if (type !== 'info') {
        setTimeout(() => {
            element.className = 'status-message';
        }, 4000);
    }
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
        fileItem.style.animation = `slideInCard 0.3s ease-out ${index * 0.05}s both`;
        fileItem.innerHTML = `
            <div class="file-header">
                <div class="file-name">📦 ${tool.name}</div>
                <div class="file-date">${new Date(tool.date).toLocaleDateString()}</div>
            </div>
            <div class="file-description">${tool.description}</div>
            <div class="file-source" style="font-size: 0.85em; color: var(--text-secondary); margin: 8px 0;">
                📊 ${formatFileSize(tool.size || 0)} • 📍 ${tool.source === 'github' ? '🐙 GitHub (Small)' : tool.source === 'github-repo' ? '🐙 GitHub (Large Upload)' : '💾 Local Upload'}
            </div>
            <div class="file-actions">
                <button class="btn-edit" onclick="openEditModal(${index})">✏️ Edit</button>
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
        readmeItem.style.animation = `slideInCard 0.3s ease-out ${index * 0.05}s both`;
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

// ===== EDIT FUNCTIONS =====
function openEditModal(index) {
    toEditFileIndex = index;
    const tool = tools[index];
    
    document.getElementById('editFileName').value = tool.name;
    document.getElementById('editFileDescription').value = tool.description;
    document.getElementById('editReadmeContent').value = tool.readme;
    
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    toEditFileIndex = null;
}

function saveEdit() {
    if (toEditFileIndex === null) return;

    tools[toEditFileIndex].name = document.getElementById('editFileName').value;
    tools[toEditFileIndex].description = document.getElementById('editFileDescription').value;
    tools[toEditFileIndex].readme = document.getElementById('editReadmeContent').value;

    localStorage.setItem('tools', JSON.stringify(tools));
    closeEditModal();
    loadFilesList();
    loadReadmeList();
    
    showStatus('uploadStatus', '✅ File updated successfully!', 'success');
}

// ===== DELETE FUNCTIONS =====
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
    const editModal = document.getElementById('editModal');

    if (readmeModal && event.target === readmeModal) {
        readmeModal.style.display = 'none';
    }
    if (deleteModal && event.target === deleteModal) {
        closeDeleteModal();
    }
    if (editModal && event.target === editModal) {
        closeEditModal();
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    loadTools();
    loadLinks();
    
    if (document.getElementById('toolsGrid')) {
        startRealTimeUpdates();
    }
});