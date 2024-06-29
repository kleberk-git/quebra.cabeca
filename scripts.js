// scripts.js

const imageParts = {
    'imagem1': 'parte1.jpg',
    'imagem2': 'parte2.jpg',
    'imagem3': 'parte3.jpg',
    'imagem4': 'parte4.jpg'
};

const seloCampeao = 'selo-campeao.jpg'; // caminho da imagem do selo
let html5QrCode; // Variável para armazenar a instância do leitor QR Code

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
        };

        // Cria o leitor QR Code após a inicialização da câmera
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        };
        html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start({ facingMode: 'environment' }, config, onScanSuccess)
            .catch(err => console.error("Erro ao iniciar a leitura de QR Code", err));

    } catch (error) {
        console.error('Erro ao acessar a câmera:', error);
        alert('Não foi possível acessar a câmera. Verifique suas permissões ou tente em outro navegador.');
    }
}

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

document.getElementById('start-button').addEventListener('click', iniciarCamera);

document.getElementById('close-camera').addEventListener('click', () => {
    const videoElement = document.querySelector('video');
    if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    
    if (html5QrCode) {
        html5QrCode.stop().then(ignore => {
            console.log("Leitura de QR Code parada com sucesso");
        }).catch(err => {
            console.error("Erro ao parar a leitura de QR Code", err);
        });
    }

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
