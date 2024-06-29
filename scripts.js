const imageParts = {
    'imagem1': 'parte1.jpg',
    'imagem2': 'parte2.jpg',
    'imagem3': 'parte3.jpg',
    'imagem4': 'parte4.jpg'
};

const seloCampeao = 'selo-campeao.jpg'; // caminho da imagem do selo

function onScanSuccess(decodedText, decodedResult) {
    if (imageParts.hasOwnProperty(decodedText)) {
        if (!localStorage.getItem(decodedText)) {
            localStorage.setItem(decodedText, 'encontrada');
            mostrarParteImagem(decodedText);
        } else {
            alert('Você já encontrou esta parte!');
        }
    } else {
        alert('QR Code não reconhecido!');
    }

    verificarConclusao();
}

function mostrarParteImagem(imagem) {
    const slotId = `slot${Object.keys(imageParts).indexOf(imagem) + 1}`;
    const slot = document.getElementById(slotId);
    slot.style.backgroundImage = `url(${imageParts[imagem]})`;
    slot.style.color = 'transparent';
}

function verificarConclusao() {
    let allFound = true;
    for (let key in imageParts) {
        if (!localStorage.getItem(key)) {
            allFound = false;
            break;
        }
    }

    if (allFound) {
        document.getElementById('message').innerText = 'Parabéns! Você encontrou todas as partes!';
        document.getElementById('download-button').disabled = false;
        return true;
    }
    return false;
}

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('qr-reader-container').style.display = 'block';
    
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 }
    };

    const html5QrCode = new Html5Qrcode("reader");

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const facingMode = isMobile ? { facingMode: "environment" } : { facingMode: "user" };

    html5QrCode.start(
        facingMode,
        config,
        onScanSuccess
    ).catch(err => {
        console.error("Erro ao iniciar a leitura de QR Code", err);
    });
});

document.getElementById('close-reader').addEventListener('click', () => {
    document.getElementById('qr-reader-container').style.display = 'none';
    html5QrCode.stop().then(ignore => {
        // Parou a leitura com sucesso
    }).catch(err => {
        console.error("Erro ao parar a leitura de QR Code", err);
    });
});

document.getElementById('download-button').addEventListener('click', () => {
    if (!verificarConclusao()) {
        alert('Você ainda não encontrou todas as partes!');
        return;
    }
    const link = document.createElement('a');
    link.href = seloCampeao;
    link.download = 'selo-campeao.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

window.onload = function() {
    for (let key in imageParts) {
        if (localStorage.getItem(key)) {
            mostrarParteImagem(key);
        }
    }
    verificarConclusao();
}

window.onbeforeunload = function() {
    return "Você tem certeza que quer sair? Todo o progresso será perdido.";
};
const messageBubble = document.getElementById('message-bubble');

messageBubble.addEventListener('click', () => {
    messageBubble.style.display = 'none';
});
