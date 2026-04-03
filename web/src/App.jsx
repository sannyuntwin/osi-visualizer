import React, { useEffect, useMemo, useState } from 'react';
import { osiLayers } from './data/layers';
import './App.css';

const flowLabels = {
  idle: 'Ready to simulate traffic',
  send: 'Sending payload from Layer 7 to Layer 1',
  receive: 'Receiving payload from Layer 1 to Layer 7'
};

const beginnerSteps = [
  {
    title: 'You create a message',
    detail: 'This starts at the Application layer, where apps like browsers, email, and chat tools live.'
  },
  {
    title: 'The network wraps it',
    detail: 'Each lower layer adds instructions so the message can travel safely and reach the right destination.'
  },
  {
    title: 'The receiver unwraps it',
    detail: 'At the other side, those instructions are removed until the original message is ready for the app again.'
  }
];

const glossaryItems = [
  {
    term: 'Layer',
    meaning: 'A step in the communication process. Each layer has one job and passes the result to the next one.'
  },
  {
    term: 'Encapsulation',
    meaning: 'Adding extra information around data so it can travel through the network.'
  },
  {
    term: 'Packet',
    meaning: 'A chunk of network data that includes both your message and delivery information.'
  },
  {
    term: 'Protocol',
    meaning: 'A shared rule that devices follow so they can communicate correctly.'
  }
];

const tutorialLessons = [
  {
    layer: 7,
    title: 'Application Layer',
    simple: 'This is where people and apps interact with the network.',
    example: 'When you open a browser and visit a site, the request begins here.'
  },
  {
    layer: 6,
    title: 'Presentation Layer',
    simple: 'This layer prepares the data so both sides understand it the same way.',
    example: 'It may format text, compress files, or handle encryption like TLS.'
  },
  {
    layer: 5,
    title: 'Session Layer',
    simple: 'This layer helps keep the conversation between devices organized.',
    example: 'It helps track whether a communication session is still open and active.'
  },
  {
    layer: 4,
    title: 'Transport Layer',
    simple: 'This layer makes sure data gets to the right app and in the right way.',
    example: 'TCP and UDP live here, helping decide reliability and port delivery.'
  },
  {
    layer: 3,
    title: 'Network Layer',
    simple: 'This layer decides where the data should travel across networks.',
    example: 'IP addresses are used here so routers know where to send the packet.'
  },
  {
    layer: 2,
    title: 'Data Link Layer',
    simple: 'This layer moves data across the local network connection.',
    example: 'It uses MAC addresses to move frames between nearby devices.'
  },
  {
    layer: 1,
    title: 'Physical Layer',
    simple: 'This is the actual signal moving through cable, fiber, or air.',
    example: 'At this point, the message becomes electrical, optical, or radio signals.'
  }
];

const navigationItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'journey', label: 'Message Journey' },
  { id: 'workspace', label: 'Stack View' }
];

const workspaceTabs = [
  { id: 'payload-lab', label: 'Message View' },
  { id: 'stack', label: 'OSI Stack' }
];

const STORAGE_KEYS = {
  theme: 'osi-theme',
  sidebarCollapsed: 'osi-sidebar-collapsed',
  activeTab: 'osi-active-workspace-tab',
  message: 'osi-message'
};

const DEFAULT_MESSAGE = 'OSI helps explain how network communication is organized.';

function App() {
  const [animatingLayer, setAnimatingLayer] = useState(null);
  const [dataFlow, setDataFlow] = useState('idle');
  const [selectedLayerNumber, setSelectedLayerNumber] = useState(7);
  const [message, setMessage] = useState(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_MESSAGE;
    }
    return (
      window.localStorage.getItem(STORAGE_KEYS.message) ||
      DEFAULT_MESSAGE
    );
  });
  const [activeSection, setActiveSection] = useState('overview');
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'stack';
    const saved = window.localStorage.getItem(STORAGE_KEYS.activeTab);
    return workspaceTabs.some((tab) => tab.id === saved) ? saved : 'stack';
  });
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true';
  });
  const [toast, setToast] = useState(null);
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isLessonPlaying, setIsLessonPlaying] = useState(false);

  const activeLayer = useMemo(
    () => osiLayers.find((layer) => layer.number === animatingLayer) ?? null,
    [animatingLayer]
  );
  const selectedLayer = useMemo(
    () => osiLayers.find((layer) => layer.number === selectedLayerNumber) ?? osiLayers[0],
    [selectedLayerNumber]
  );
  const transformationSteps = useMemo(() => {
    const steps = {
      7: {
        title: 'Application data',
        detail: `User payload prepared for transmission.`,
        preview: `DATA="${message}"`
      },
      6: {
        title: 'Presentation formatting',
        detail: 'The payload is translated into a transferable representation and can be encrypted.',
        preview: `TLS{ENCODE(${message})}`
      },
      5: {
        title: 'Session context',
        detail: 'A session identity helps maintain the conversation between endpoints.',
        preview: `SID[84A2] -> TLS{ENCODE(${message})}`
      },
      4: {
        title: 'Transport segment',
        detail: 'Source and destination ports are attached for end-to-end delivery.',
        preview: `TCP[443->51514] + SID[84A2] + ${message}`
      },
      3: {
        title: 'Network packet',
        detail: 'Logical addressing is added so routers know where the packet should go.',
        preview: `IP[192.168.1.100->192.168.1.200] + TCP[443] + ${message}`
      },
      2: {
        title: 'Data link frame',
        detail: 'MAC addresses frame the packet for the local network segment.',
        preview: `ETH[00:11:22:33:44:55->66:77:88:99:AA:BB] + IP + ${message}`
      },
      1: {
        title: 'Physical signal',
        detail: 'Bits are transmitted as electrical, optical, or radio signals over the medium.',
        preview: '01001111 01010011 01001001 ...'
      }
    };

    return osiLayers.map((layer) => ({
      ...layer,
      ...steps[layer.number]
    }));
  }, [message]);
  const journeyByLayer = useMemo(
    () =>
      Object.fromEntries(
        transformationSteps.map((step) => [step.number, step])
      ),
    [transformationSteps]
  );
  const previewLayerNumber = animatingLayer ?? selectedLayerNumber;
  const previewStep = useMemo(
    () => transformationSteps.find((step) => step.number === previewLayerNumber) ?? transformationSteps[0],
    [previewLayerNumber, transformationSteps]
  );
  const currentLesson = tutorialLessons[tutorialStep];
  const currentAnimatedStep = animatingLayer ? journeyByLayer[animatingLayer] : null;

  useEffect(() => {
    const sectionElements = navigationItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-12% 0px -55% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7]
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.activeTab, activeTab);
  }, [activeTab]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.message, message);
  }, [message]);

  useEffect(() => {
    setSelectedLayerNumber(currentLesson.layer);
  }, [currentLesson.layer]);

  useEffect(() => {
    if (!isLessonPlaying) return undefined;

    setActiveTab('stack');

    const interval = window.setInterval(() => {
      setTutorialStep((step) => {
        if (step >= tutorialLessons.length - 1) {
          setIsLessonPlaying(false);
          setToast({ type: 'info', message: 'Lesson complete' });
          return step;
        }
        return step + 1;
      });
    }, 2200);

    return () => window.clearInterval(interval);
  }, [isLessonPlaying]);

  const resetPreferences = () => {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
    }

    setTheme('light');
    setSidebarCollapsed(false);
    setActiveTab('stack');
    setMessage(DEFAULT_MESSAGE);
    setToast({ type: 'info', message: 'Preferences reset to defaults' });
  };

  const toggleTheme = () => {
    setTheme((value) => {
      const nextTheme = value === 'light' ? 'dark' : 'light';
      setToast({
        type: 'info',
        message: `${nextTheme === 'light' ? 'Light' : 'Dark'} mode enabled`
      });
      return nextTheme;
    });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((value) => {
      const nextValue = !value;
      setToast({
        type: 'info',
        message: nextValue ? 'Sidebar collapsed' : 'Sidebar expanded'
      });
      return nextValue;
    });
  };

  const toggleLessonPlayback = () => {
    setIsLessonPlaying((value) => {
      const nextValue = !value;
      setToast({
        type: 'info',
        message: nextValue ? 'Lesson autoplay started' : 'Lesson autoplay paused'
      });
      return nextValue;
    });
  };

  const getLayerIcon = (number) => {
    const icons = {
      7: 'APP',
      6: 'PRS',
      5: 'SES',
      4: 'TRN',
      3: 'NET',
      2: 'DLK',
      1: 'PHY'
    };
    return icons[number] || 'OSI';
  };

  const getDataPacket = (layer) => journeyByLayer[layer.number]?.preview || 'Data';

  const startDataFlow = (direction) => {
    if (dataFlow !== 'idle') return;

    setDataFlow(direction);
    setToast({
      type: direction === 'send' ? 'send' : 'receive',
      message: direction === 'send' ? 'Send simulation started' : 'Receive simulation started'
    });
    let currentLayer = direction === 'send' ? 7 : 1;

    const interval = setInterval(() => {
      setAnimatingLayer(currentLayer);

      if (direction === 'send' && currentLayer > 1) {
        currentLayer -= 1;
      } else if (direction === 'receive' && currentLayer < 7) {
        currentLayer += 1;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setAnimatingLayer(null);
          setDataFlow('idle');
        }, 700);
      }
    }, 800);
  };

  const resetAnimation = () => {
    setAnimatingLayer(null);
    setDataFlow('idle');
    setToast({ type: 'info', message: 'Animation reset' });
  };

  return (
    <div className="app-shell">
      <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <aside className="sidebar-nav">
          <div className="sidebar-card">
            <div className="sidebar-topbar">
              <div className="sidebar-heading">
                <p className="eyebrow">Navigator</p>
                <h2>OSI Dashboard</h2>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={toggleSidebar}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? '>>' : '<<'}
              </button>
            </div>

            {!sidebarCollapsed && (
              <p className="sidebar-copy">
                Jump to the part you want instead of scrolling through one long page.
              </p>
            )}

            <nav className="nav-list" aria-label="Section navigation">
              {navigationItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-link ${activeSection === item.id ? 'is-active' : ''}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="nav-link-label">{item.label}</span>
                </a>
              ))}
            </nav>

            <div className="sidebar-actions">
              <button
                className="btn btn-primary"
                onClick={() => startDataFlow('send')}
                disabled={dataFlow !== 'idle'}
              >
                Simulate Send
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => startDataFlow('receive')}
                disabled={dataFlow !== 'idle'}
              >
                Simulate Receive
              </button>
              <button className="btn btn-ghost" onClick={resetAnimation}>
                Reset
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={toggleTheme}
              >
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={resetPreferences}
              >
                Reset Prefs
              </button>
            </div>
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="utility-bar">
            <div className="utility-group">
              <span className="utility-label">Status</span>
              <strong>{flowLabels[dataFlow]}</strong>
            </div>
            <div className="utility-group">
              <span className="utility-label">Layer</span>
              <strong>{activeLayer ? `${activeLayer.number} · ${activeLayer.name}` : `${selectedLayer.number} · ${selectedLayer.name}`}</strong>
            </div>
            <div className="utility-group">
              <span className="utility-label">Workspace</span>
              <strong>{workspaceTabs.find((tab) => tab.id === activeTab)?.label}</strong>
            </div>
            <div className="utility-group">
              <span className="utility-label">Theme</span>
              <strong>{theme === 'light' ? 'Light' : 'Dark'}</strong>
            </div>
            <div className="utility-actions">
              <button
                className="btn btn-primary"
                onClick={() => startDataFlow('send')}
                disabled={dataFlow !== 'idle'}
              >
                Send
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => startDataFlow('receive')}
                disabled={dataFlow !== 'idle'}
              >
                Receive
              </button>
              <button className="btn btn-ghost" onClick={resetAnimation}>
                Reset
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={toggleTheme}
              >
                {theme === 'light' ? 'Dark' : 'Light'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={resetPreferences}
              >
                Reset Prefs
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setBeginnerMode((value) => !value)}
              >
                {beginnerMode ? 'Hide Guide' : 'Show Guide'}
              </button>
            </div>
          </section>

          {toast && (
            <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
              {toast.message}
            </div>
          )}

          {beginnerMode && (
            <section className="beginner-panel">
              <article className="beginner-hero">
                <p className="eyebrow">Start Here</p>
                <h2>What is the OSI model, in simple words?</h2>
                <p className="beginner-copy">
                  The OSI model is a way to explain how one device sends information to another.
                  Instead of treating networking as one big mystery, it breaks the trip into seven smaller jobs.
                </p>
                <div className="beginner-callout">
                  Real-life story: when you open a website, your device prepares the request, addresses it,
                  sends it through the network, and the server unwraps it so the app can understand it.
                </div>
              </article>

              <article className="beginner-story">
                <p className="eyebrow">Three-Step Story</p>
                <div className="beginner-steps">
                  {beginnerSteps.map((step, index) => (
                    <div key={step.title} className="beginner-step">
                      <span className="beginner-step-number">0{index + 1}</span>
                      <div>
                        <strong>{step.title}</strong>
                        <p>{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="glossary-panel">
                <p className="eyebrow">Quick Glossary</p>
                <div className="glossary-grid">
                  {glossaryItems.map((item) => (
                    <div key={item.term} className="glossary-card">
                      <strong>{item.term}</strong>
                      <p>{item.meaning}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="tutorial-panel">
                <div className="tutorial-header">
                  <div>
                    <p className="eyebrow">Guided Lesson</p>
                    <h2>Learn one layer at a time</h2>
                  </div>
                  <span className="tutorial-progress">
                    Step {tutorialStep + 1} of {tutorialLessons.length}
                  </span>
                </div>

                <div className="tutorial-card" style={{ '--layer-color': osiLayers.find((layer) => layer.number === currentLesson.layer)?.color }}>
                  <span className="tutorial-layer-tag">Layer {currentLesson.layer}</span>
                  <h3>{currentLesson.title}</h3>
                  <p>{currentLesson.simple}</p>
                  <div className="tutorial-example">
                    <strong>Real-world example</strong>
                    <p>{currentLesson.example}</p>
                  </div>
                </div>

                <div className="tutorial-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setTutorialStep((step) => Math.max(0, step - 1))}
                    disabled={tutorialStep === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setTutorialStep((step) => Math.min(tutorialLessons.length - 1, step + 1))}
                    disabled={tutorialStep === tutorialLessons.length - 1}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setActiveTab('stack')}
                  >
                    Show In Stack
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={toggleLessonPlayback}
                  >
                    {isLessonPlaying ? 'Pause Lesson' : 'Play Lesson'}
                  </button>
                </div>
              </article>
            </section>
          )}

          <section id="overview" className="hero-panel">
            <div className="hero-copy">
              <p className="eyebrow">Network learning studio</p>
              <h1>Follow a message as it moves through the OSI stack.</h1>
              <p className="hero-text">
                Type a message like <code>hello</code>, then watch how that exact message gets wrapped,
                addressed, framed, and transmitted through all 7 OSI layers.
              </p>
            </div>

            <div className="hero-status-card">
              <div className="status-chip">{flowLabels[dataFlow]}</div>
              <div className="status-grid">
                <div>
                  <span className="status-label">Direction</span>
                  <strong>{dataFlow === 'idle' ? 'Waiting' : dataFlow}</strong>
                </div>
                <div>
                  <span className="status-label">Active layer</span>
                  <strong>{activeLayer ? `L${activeLayer.number}` : 'None'}</strong>
                </div>
                <div>
                  <span className="status-label">Frame state</span>
                  <strong>{currentAnimatedStep ? currentAnimatedStep.title : 'Standing by'}</strong>
                </div>
              </div>
              <div className="signal-bars" aria-hidden="true">
                {osiLayers.map((layer) => (
                  <span
                    key={layer.number}
                    className={`signal-bar ${animatingLayer === layer.number ? 'is-live' : ''}`}
                    style={{ '--layer-color': layer.color }}
                  />
                ))}
              </div>
            </div>
          </section>

          <section id="journey" className="journey-focus">
            <article className="journey-focus-main">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Main Flow</p>
                  <h2>Type a message. Send it. Watch all 7 layers.</h2>
                </div>
                <p className="section-note">
                  This is the simplest way to understand the OSI model: one message changing shape as it travels.
                </p>
              </div>

              <label className="composer-label" htmlFor="journey-message-input">
                Your message
              </label>
              <textarea
                id="journey-message-input"
                className="message-input"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
              />

              <div className="journey-quick-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setActiveTab('stack');
                      startDataFlow('send');
                  }}
                  disabled={dataFlow !== 'idle'}
                >
                  Send Through 7 Layers
                </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setActiveTab('stack');
                      startDataFlow('receive');
                  }}
                  disabled={dataFlow !== 'idle'}
                >
                  Receive Back Through 7 Layers
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setActiveTab('stack');
                    setToast({ type: 'info', message: 'Opened stack view' });
                  }}
                >
                  Open Stack View
                </button>
              </div>

              <div className="journey-summary-grid">
                {transformationSteps.map((step) => (
                  <div
                    key={step.number}
                    className={`journey-summary-card ${previewLayerNumber === step.number ? 'is-current' : ''}`}
                    style={{ '--layer-color': step.color }}
                  >
                    <div className="journey-summary-topline">
                      <strong>Layer {step.number}</strong>
                      <span>{step.title}</span>
                    </div>
                    <code>{step.preview}</code>
                  </div>
                ))}
              </div>
            </article>

            <aside className="journey-focus-side">
              <div className="focus-steps-card">
                <p className="eyebrow">How To Use</p>
                <div className="focus-steps">
                  <div className="focus-step">
                    <span>1</span>
                    <p>Type a message such as <code>hello</code>.</p>
                  </div>
                  <div className="focus-step">
                    <span>2</span>
                    <p>Click <strong>Send Through 7 Layers</strong>.</p>
                  </div>
                  <div className="focus-step">
                    <span>3</span>
                    <p>Watch the message change from Layer 7 down to Layer 1.</p>
                  </div>
                  <div className="focus-step">
                    <span>4</span>
                    <p>Click receive to watch the reverse journey back up.</p>
                  </div>
                </div>
              </div>

              <div className="focus-live-card">
                <p className="eyebrow">{currentAnimatedStep ? 'Message Moving Now' : 'Current Step'}</p>
                <h3>
                  Layer {(currentAnimatedStep || previewStep).number}: {(currentAnimatedStep || previewStep).title}
                </h3>
                <p>{(currentAnimatedStep || previewStep).detail}</p>
                <pre className="packet-preview">{(currentAnimatedStep || previewStep).preview}</pre>
              </div>
            </aside>
          </section>

          <section id="workspace" className="workspace-shell">
            <div className="workspace-tabs" role="tablist" aria-label="Workspace tabs">
              {workspaceTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`workspace-tab ${activeTab === tab.id ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'payload-lab' && (
              <section className="message-lab workspace-panel">
                <article className="composer-card">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Payload lab</p>
                      <h2>Try your own message</h2>
                    </div>
                    <p className="section-note">
                      Type something simple like <code>hello</code> and watch each layer add the information needed to move it across the network.
                    </p>
                  </div>

                  <label className="composer-label" htmlFor="message-input">
                    Application payload
                  </label>
                  <textarea
                    id="message-input"
                    className="message-input"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={4}
                  />

                  <div className="timeline-card">
                    <div className="timeline-header">
                      <div>
                        <span className="insight-kicker">Live preview</span>
                        <h3>{previewStep.title}</h3>
                      </div>
                      <span className="timeline-layer">Layer {previewStep.number}</span>
                    </div>
                    <p>{previewStep.detail}</p>
                    <pre className="packet-preview">{previewStep.preview}</pre>
                  </div>
                </article>

                <article className="journey-card">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Transformation map</p>
                      <h2>Encapsulation timeline</h2>
                    </div>
                  </div>

                  <div className="journey-steps">
                    {transformationSteps.map((step) => (
                      <div
                        key={step.number}
                        className={`journey-step ${previewLayerNumber === step.number ? 'is-current' : ''}`}
                        style={{ '--layer-color': step.color }}
                      >
                        <div className="journey-topline">
                          <strong>Layer {step.number}</strong>
                          <span>{step.title}</span>
                        </div>
                        <p>{step.detail}</p>
                        <code>{step.preview}</code>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            )}

            {activeTab === 'stack' && (
              <section className="workspace-grid workspace-panel">
                <article className="stack-panel">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Seven layers</p>
                      <h2>Interactive protocol stack</h2>
                    </div>
                    <p className="section-note">
                      Watch each layer do one part of the job during send, then reverse that job during receive.
                    </p>
                  </div>

                  <div className={`transit-rail flow-${dataFlow}`}>
                    {osiLayers.map((layer) => (
                      <div
                        key={layer.number}
                        className={`layer-card ${animatingLayer === layer.number ? 'is-active' : ''} ${selectedLayerNumber === layer.number ? 'is-selected' : ''}`}
                        style={{ '--layer-color': layer.color }}
                        onClick={() => setSelectedLayerNumber(layer.number)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setSelectedLayerNumber(layer.number);
                          }
                        }}
                      >
                        {animatingLayer === layer.number && (
                          <div className={`packet-orb direction-${dataFlow}`} aria-hidden="true">
                            <span />
                          </div>
                        )}
                        <div className="layer-topline">
                          <span className="layer-number">Layer {layer.number}</span>
                          <span className="layer-code">{getLayerIcon(layer.number)}</span>
                        </div>

                        <div className="layer-main">
                          <div>
                            <h3>{layer.name}</h3>
                            <p>{layer.fullDescription}</p>
                          </div>
                          <div className="layer-tags">
                            {layer.protocols.slice(0, 3).map((protocol) => (
                              <span key={protocol}>{protocol}</span>
                            ))}
                          </div>
                        </div>

                        <div className="layer-message-preview">
                          <span className="layer-message-label">
                            {animatingLayer === layer.number ? 'Message at this step' : 'Message form at this layer'}
                          </span>
                          <code>{journeyByLayer[layer.number]?.preview}</code>
                        </div>

                        <div className="layer-footer">
                          <div className="layer-functions">
                            {layer.functions.slice(0, 2).map((item) => (
                              <span key={item}>{item}</span>
                            ))}
                          </div>
                          {animatingLayer === layer.number && (
                            <div className="packet-pill">Active message is here right now</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <aside className="insight-panel">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Quick guide</p>
                      <h2>What to notice</h2>
                    </div>
                  </div>

                  <div className="insight-card">
                    <span className="insight-kicker">Current focus</span>
                    <h3>{activeLayer ? activeLayer.name : 'Idle simulation'}</h3>
                    <p>
                      {activeLayer
                        ? activeLayer.fullDescription
                        : 'Start a send or receive simulation to highlight each layer and the data unit it handles.'}
                    </p>
                  </div>

                  <div className="insight-card">
                    <span className="insight-kicker">Encapsulation rule</span>
                    <p>
                      Data gains headers as it moves downward through the stack, then loses them in reverse as the receiver interprets the message.
                    </p>
                  </div>

                  <div className="insight-card detail-card" style={{ '--layer-color': selectedLayer.color }}>
                    <span className="insight-kicker">Selected layer</span>
                    <h3>
                      Layer {selectedLayer.number}: {selectedLayer.name}
                    </h3>
                    <p>{selectedLayer.fullDescription}</p>

                    <div className="detail-group">
                      <strong>Common protocols</strong>
                      <div className="detail-pills">
                        {selectedLayer.protocols.map((protocol) => (
                          <span key={protocol}>{protocol}</span>
                        ))}
                      </div>
                    </div>

                    <div className="detail-group">
                      <strong>Key responsibilities</strong>
                      <ul className="detail-list">
                        {selectedLayer.functions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="legend-list">
                    {osiLayers.map((layer) => (
                      <div key={layer.number} className="legend-row">
                        <span
                          className="legend-swatch"
                          style={{ '--layer-color': layer.color }}
                        />
                        <div>
                          <strong>{layer.name}</strong>
                          <p>{layer.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              </section>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
