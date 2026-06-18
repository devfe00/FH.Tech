// Formulário de contato: envio via WhatsApp ou e-mail (mailto)
function getFormValues() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const service = document.getElementById('service');
    const message = document.getElementById('message');

    if (!name || !email || !service || !message) {
        alert('Erro: elementos do formulário não encontrados. Tente recarregar a página.');
        return null;
    }

    if (!name.value.trim() || !email.value.trim() || !service.value || !message.value.trim()) {
        alert('Por favor, preencha todos os campos obrigatórios (Nome, Email, Serviço e Mensagem).');
        return null;
    }

    return {
        name: name.value.trim(),
        email: email.value.trim(),
        phone: phone && phone.value.trim() ? phone.value.trim() : 'Não informado',
        service: service.value,
        message: message.value.trim(),
    };
}

function sendWhatsAppMessage() {
    const data = getFormValues();
    if (!data) return;

    const text = `Olá! Gostaria de solicitar o serviço: ${data.service}

Nome: ${data.name}
Email: ${data.email}
Telefone: ${data.phone}
Mensagem: ${data.message}`;

    window.open(`https://wa.me/5511956795412?text=${encodeURIComponent(text)}`, '_blank');
}

function sendEmailMessage() {
    const data = getFormValues();
    if (!data) return;

    const subject = `Solicitação de Serviço: ${data.service}`;
    const body = `Nome: ${data.name}
Email: ${data.email}
Telefone: ${data.phone}
Serviço: ${data.service}

Mensagem:
${data.message}`;

    window.location.href = `mailto:flyhighcontato@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

window.sendWhatsAppMessage = sendWhatsAppMessage;
window.sendEmailMessage = sendEmailMessage;
