import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

function detectPlatform() {
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (standalone) return "installed";
  if (ios && /CriOS/.test(ua)) return "ios-chrome";
  if (ios && /FxiOS|EdgiOS/.test(ua)) return "ios-other";
  if (ios) return "ios-safari";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

function InstallSteps({ platform, installPrompt, onInstall }) {
  if (platform === "installed") {
    return <p className="note">Você está usando o app instalado. Marque o placar sempre por este ícone.</p>;
  }
  if (platform === "ios-chrome") {
    return (
      <ol className="steps">
        <li>Toque em <strong>Compartilhar</strong> (o ícone <span aria-hidden="true">⬆</span> na barra de endereço do Chrome, ou no menu <strong>⋯</strong>).</li>
        <li>Escolha <strong>Adicionar à Tela de Início</strong> e confirme.</li>
        <li>Abra o placar pelo novo ícone, ainda com internet, e espere aparecer “Pronto para jogar sem internet”.</li>
      </ol>
    );
  }
  if (platform === "ios-safari" || platform === "ios-other") {
    return (
      <ol className="steps">
        <li>Toque em <strong>Compartilhar</strong> <span aria-hidden="true">⬆</span>.</li>
        <li>Escolha <strong>Adicionar à Tela de Início</strong> e confirme.</li>
        <li>Abra o placar pelo novo ícone, ainda com internet, e espere aparecer “Pronto para jogar sem internet”.</li>
      </ol>
    );
  }
  if (installPrompt) {
    return (
      <div className="actions">
        <button type="button" className="primary" onClick={onInstall}>Instalar no aparelho</button>
      </div>
    );
  }
  return (
    <p className="note">
      No menu do navegador, escolha <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.
    </p>
  );
}

export function useOffline() {
  const supported = "serviceWorker" in navigator;
  const [platform] = useState(detectPlatform);
  const [controlled, setControlled] = useState(() => supported && !!navigator.serviceWorker.controller);
  const [installPrompt, setInstallPrompt] = useState(null);

  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (!supported) return undefined;
    const onChange = () => setControlled(!!navigator.serviceWorker.controller);
    navigator.serviceWorker.addEventListener("controllerchange", onChange);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", onChange);
  }, [supported]);

  useEffect(() => {
    const onPrompt = (ev) => {
      ev.preventDefault();
      setInstallPrompt(ev);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  useEffect(() => {
    // Pede ao navegador para não apagar o placar quando faltar espaço.
    navigator.storage?.persist?.().catch(() => {});
  }, []);

  const ready = offlineReady || controlled;
  const status = !supported
    ? { tone: "off", text: "Este navegador não guarda o app para uso offline." }
    : ready
      ? { tone: "on", text: "Pronto para jogar sem internet" }
      : { tone: "wait", text: "Preparando o modo offline…" };

  const install = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice.catch(() => {});
    setInstallPrompt(null);
  };

  return { status, platform, installPrompt, install, needRefresh, update: () => updateServiceWorker(true) };
}

export function OfflinePill({ offline, panelRef }) {
  const { status } = offline;
  return (
    <button
      type="button" className={`pill pill-${status.tone}`}
      onClick={() => {
        panelRef.current.open = true;
        panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      <span className="dot" aria-hidden="true" /> {status.text}
    </button>
  );
}

export function UpdateBanner({ offline }) {
  if (!offline.needRefresh) return null;
  return (
    <div className="update" role="status">
      <span>Tem uma versão nova do placar. O jogo em andamento não se perde.</span>
      <button type="button" className="primary" onClick={offline.update}>Atualizar</button>
    </div>
  );
}

export function OfflinePanel({ offline, panelRef }) {
  const { status, platform, installPrompt, install } = offline;
  return (
    <details className="panel" ref={panelRef}>
      <summary>Usar sem internet</summary>
      <div className="panel-body">
        <p className={`status status-${status.tone}`}>
          <span className="dot" aria-hidden="true" /> {status.text}
          {status.tone === "wait" && ". Deixe a internet ligada alguns segundos."}
        </p>
        <InstallSteps platform={platform} installPrompt={installPrompt} onInstall={install} />
        {platform.startsWith("ios") && (
          <p className="note">
            No iPhone, o app da tela inicial guarda um placar separado do que fica aberto no navegador.
            Depois de instalar, marque sempre pelo ícone. O iPhone também pode apagar dados de sites
            abertos só no navegador e esquecidos por alguns dias; o app instalado fica protegido disso.
          </p>
        )}
      </div>
    </details>
  );
}
