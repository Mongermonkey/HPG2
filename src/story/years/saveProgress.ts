
import { MainChara } from "../../basis/_index";
import { saveCharacterToFile } from '../../ui/characterPopup';

/**
 * Mostra un popup di fine anno per chiedere se salvare i progressi.
 * Se l'utente clicca 'yes', chiama saveCharacterToFile.
 */
export function saveProgress(chara: MainChara<'Wizard'>)
{
    // Overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.inset = '0';
    modalOverlay.style.background = 'rgba(0,0,0,0.45)';
    modalOverlay.style.zIndex = '99999';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';

    // Modale
    const modal = document.createElement('div');
    modal.style.background = 'rgb(28,28,38)';
    modal.style.border = '2px solid rgb(80,80,88)';
    modal.style.borderRadius = '10px';
    modal.style.padding = '28px 28px 18px 28px';
    modal.style.boxShadow = '0 2px 24px rgba(0,0,0,0.25)';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';
    modal.style.minWidth = '320px';
    modal.style.marginTop = '7vh';
    modalOverlay.style.alignItems = 'flex-start';

    const label = document.createElement('div');
    label.textContent = 'Another year has ended! save progress?';
    label.style.fontFamily = 'monospace';
    label.style.fontSize = '17px';
    label.style.color = 'rgb(232,232,240)';
    label.style.marginBottom = '18px';
    label.style.display = 'block';

    const btnWrap = document.createElement('div');
    btnWrap.style.display = 'flex';
    btnWrap.style.gap = '16px';

    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'yes';
    yesBtn.style.fontFamily = 'monospace';
    yesBtn.style.fontSize = '15px';
    yesBtn.style.padding = '7px 18px';
    yesBtn.style.background = 'rgb(40,40,48)';
    yesBtn.style.color = 'rgb(232,232,240)';
    yesBtn.style.border = '2px solid rgb(80,80,88)';
    yesBtn.style.borderRadius = '7px';
    yesBtn.style.cursor = 'pointer';
    yesBtn.style.marginTop = '4px';

    const noBtn = document.createElement('button');
    noBtn.textContent = 'no';
    noBtn.style.fontFamily = 'monospace';
    noBtn.style.fontSize = '15px';
    noBtn.style.padding = '7px 18px';
    noBtn.style.background = 'rgb(40,40,48)';
    noBtn.style.color = 'rgb(232,232,240)';
    noBtn.style.border = '2px solid rgb(80,80,88)';
    noBtn.style.borderRadius = '7px';
    noBtn.style.cursor = 'pointer';
    noBtn.style.marginTop = '4px';

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    modal.appendChild(label);
    modal.appendChild(btnWrap);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    function closeModal() {
        document.body.removeChild(modalOverlay);
    }

    yesBtn.onclick = () => {
        closeModal();
        saveCharacterToFile(chara);
    };
    noBtn.onclick = () => closeModal();
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) closeModal();
    };
}
