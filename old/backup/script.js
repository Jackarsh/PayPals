// Shared JS for PayPals frontend (all pages)
// Handles modal interactions and dummy backend button actions

document.addEventListener('DOMContentLoaded', () => {
    // inject current year into footer spans
    const years = ['year', 'year2', 'year3', 'year4'];
    years.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = new Date().getFullYear();
    });

    // attach backend buttons
    const backendButtons = document.querySelectorAll('.backend-btn');
    backendButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.getAttribute('data-action') || 'action';
            const message = getBackendMessage(action);
            showModal(message);
        });
    });

    // form send message placeholder (contact page)
    const sendMsg = document.getElementById('sendMsg');
    if (sendMsg) {
        sendMsg.addEventListener('click', () => {
            const name = document.getElementById('name').value || 'User';
            const email = document.getElementById('email').value || '';
            const msg = document.getElementById('message').value || '';
            // For now we just show the modal — backend endpoint can be wired later
            showModal(`Thanks, ${name}! Message saved locally. Backend integration coming soon.`);
            // optionally clear form
            document.getElementById('contactForm').reset();
        });
    }

    // modal handling
    const modal = document.getElementById('modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const modalOkButtons = document.querySelectorAll('.modal-actions .btn');

    modalCloseButtons.forEach(b => b.addEventListener('click', closeModal));
    modalOkButtons.forEach(b => b.addEventListener('click', closeModal));

    // close modal on overlay click (only if clicking outside panel)
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // small helper for smooth navigation on same page if links with hashes are used
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            else window.location.href = this.getAttribute('href');
        });
    });
});

function getBackendMessage(action) {
    switch (action) {
        case 'add-expense':
            return 'Add Expense — backend endpoint: POST /api/expenses (integration coming soon).';
        case 'view-groups':
            return 'View Groups — backend endpoint: GET /api/groups (integration coming soon).';
        case 'settle-up':
            return 'Settle Up — will integrate with PayPal / payment provider later.';
        case 'register':
            return 'Register — backend endpoint: POST /api/users (integration coming soon).';
        case 'view-github':
            return 'Open your GitHub repo link from the README. (This is a placeholder.)';
        default:
            return 'This feature requires backend integration. Coming soon!';
    }
}

function showModal(message) {
    const modal = document.getElementById('modal');
    if (!modal) return alert(message); // fallback
    // find correct content area if multiple modals exist per page
    const content = modal.querySelector('.modal-content');
    if (content) content.textContent = message;
    modal.setAttribute('aria-hidden', 'false');
    // focus on OK button if present
    const ok = modal.querySelector('.modal-actions .btn');
    if (ok) ok.focus();
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
}
