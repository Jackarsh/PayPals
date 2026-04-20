// script.js — single-page PayPals demo
document.addEventListener('DOMContentLoaded', () => {
    // set year
    const yr = document.getElementById('yr');
    if (yr) yr.textContent = new Date().getFullYear();

    // mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const links = document.querySelector('.links');
    navToggle && navToggle.addEventListener('click', () => {
        if (!links) return;
        links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
        links.style.flexDirection = 'column';
        links.style.gap = '12px';
        links.style.padding = '12px';
        links.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))';
        links.style.position = 'absolute';
        links.style.right = '20px';
        links.style.top = '64px';
        links.style.borderRadius = '10px';
        links.style.boxShadow = '0 8px 28px rgba(2,6,23,0.6)';
    });

    // smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // backend buttons (placeholders)
    document.querySelectorAll('.backend-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action') || 'action';
            handleBackendAction(action);
        });
    });

    // contact form send
    const send = document.getElementById('sendMsg');
    send && send.addEventListener('click', () => {
        const name = document.getElementById('name').value || 'Guest';
        const email = document.getElementById('email').value || '';
        const msg = document.getElementById('message').value || '';
        showModal(`Thanks, ${name}! Message is captured for demo. Backend POST /api/contact coming soon.`);
        document.getElementById('contactForm').reset();
    });

    // modal controls
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOk').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });
});

function handleBackendAction(action) {
    switch (action) {
        case 'view-groups':
            // example fetch stub: uncomment & adapt when backend is ready
            // fetch('http://localhost:8080/api/groups').then(r=>r.json()).then(d=>showModal(JSON.stringify(d, null, 2)));
            showModal('GET /api/groups — (demo) Replace this modal with real fetch to your Spring Boot backend.');
            break;
        case 'add-expense':
            showModal('POST /api/expenses — (demo) Payload: {groupId, payerId, amount, splits}.');
            break;
        case 'settle-up':
            showModal('POST /api/settle — (demo) Will integrate with PayPal/Payment provider later.');
            break;
        case 'view-github':
            showModal('Open your GitHub repo link from README. (Demo placeholder)');
            break;
        case 'api-docs':
            showModal('API docs available at /swagger-ui.html when enabled on the backend.');
            break;
        case 'split-equal':
            showModal('Split equally — UI action stub. Backend: calculate and POST /api/expenses.');
            break;
        default:
            showModal('This is a demo placeholder. Backend integration coming soon.');
    }
}

function showModal(text) {
    const modal = document.getElementById('modal');
    if (!modal) return alert(text);
    modal.setAttribute('aria-hidden', 'false');
    const content = document.getElementById('modalContent');
    content.textContent = text;
    // focus
    setTimeout(() => {
        const ok = document.getElementById('modalOk');
        ok && ok.focus();
    }, 80);
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
}
