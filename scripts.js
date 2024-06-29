const imageParts = {
    'imagem1': 'parte1.jpg',
    'imagem2': 'parte2.jpg',
    'imagem3': 'parte3.jpg',
    'imagem4': 'parte4.jpg'
};

const seloCampeao = 'selo-campeao.jpg'; // caminho da imagem do selo
let html5QrCode; // Variável para armazenar a instância do leitor QR Code

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

document.getElementById('scan-button').addEventListener('click', () => {
    document.getElementById('camera-feed').style.display = 'flex';

    const constraints = {
        video: true
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            const video = document.getElementById('video');
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.error('Erro ao acessar a câmera: ', err);
            alert('Não foi possível acessar a câmera. Verifique suas permissões ou tente em outro navegador.');
        });
});

document.getElementById('close-camera').addEventListener('click', () => {
    const video = document.getElementById('video');
    video.pause();
    video.srcObject.getTracks()[0].stop();
    document.getElementById('camera-feed').style.display = 'none';
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
};

window.onbeforeunload = function() {
    return "Você tem certeza que quer sair? Todo o progresso será perdido.";
};

