// scripts.js

const imageParts = {
    'imagem1': 'parte1.jpg',
    'imagem2': 'parte2.jpg',
    'imagem3': 'parte3.jpg',
    'imagem4': 'parte4.jpg'
};

const seloCampeao = 'selo-campeao.jpg'; // caminho da imagem do selo
let html5QrCode; // Variável para armazenar a instância do leitor QR Code
let currentSlotIndex = 0;
const slots = ['slot1', 'slot2', 'slot3', 'slot4'];

async function iniciarCamera() {
    try {
        const videoElement = document.createElement('video');
        videoElement.setAttribute('autoplay', '');
        videoElement.setAttribute('playsinline', '');

        const constraints = {
            video: {
                facingMode: 'environment' // 'user' para câmera frontal
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;

        // Aguarda até que o vídeo esteja carregado antes de mostrar
        videoElement.onloadedmetadata = () => {
            document.getElementById('camera-feed').appendChild(videoElement);
            document.getElementById('camera-feed').style.display = 'flex';
            document.getElementById('capture-button').style.display = 'block';
            document.getElementById('close-camera').style.display = 'block';
        };

    } catch (error) {
        console.error('Erro ao acessar a câmera:', error);
        alert('Não foi possível acessar a câmera. Verifique suas permissões ou tente em outro navegador.');
    }
}

function capturarImagem() {
    const videoElement = document.querySelector('video');
    if (videoElement) {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');

        if (currentSlotIndex < slots.length) {
            const slot = document.getElementById(slots[currentSlotIndex]);
            slot.style.backgroundImage = `url(${dataURL})`;
            slot.style.color = 'transparent';
            currentSlotIndex++;
        }

        verificarConclusao();
    }
}

function verificarConclusao() {
    if (currentSlotIndex >= slots.length) {
        document.getElementById('message').innerText = 'Parabéns! Você encontrou todas as partes!';
        document.getElementById('download-button').disabled = false;
        return true;
    }
    return false;
}

document.getElementById('start-button').addEventListener('click', iniciarCamera);

document.getElementById('capture-button').addEventListener('click', capturarImagem);

document.getElementById('close-camera').addEventListener('click', () => {
    const videoElement = document.querySelector('video');
    if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    
    document.getElementById('camera-feed').style.display = 'none';
    document.getElementById('capture-button').style.display = 'none';
    document.getElementById('close-camera').style.display = 'none';
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


window.onbeforeunload = function() {
    return "Você tem certeza que quer sair? Todo o progresso será perdido.";
};

// Função para adicionar imagem manualmente ao clicar no slot
document.querySelectorAll('.image-slot').forEach(slot => {
    slot.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                slot.style.backgroundImage = `url(${event.target.result})`;
                slot.style.color = 'transparent';
            };
            reader.readAsDataURL(file);
        };
        input.click();
    });
});
