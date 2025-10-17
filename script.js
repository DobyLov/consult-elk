(() => {
  const locale = 'fr-FR';

  const openModals = new Set();
  const modalRegistry = new Map();

  const setupModal = (triggerSelectors, modalId) => {
    const modalNode = document.getElementById(modalId);
    if (!modalNode) return;

    const triggers = triggerSelectors.reduce((accumulator, selector) => {
      const nodes = document.querySelectorAll(selector);
      return accumulator.concat(Array.from(nodes));
    }, []);

    const open = (event) => {
      if (event) event.preventDefault();
      if (modalNode.classList.contains('is-visible')) return;
      modalNode.classList.add('is-visible');
      modalNode.setAttribute('aria-hidden', 'false');
      openModals.add(modalNode);
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      if (!modalNode.classList.contains('is-visible')) return;
      modalNode.classList.remove('is-visible');
      modalNode.setAttribute('aria-hidden', 'true');
      openModals.delete(modalNode);
      if (openModals.size === 0) {
        document.body.style.overflow = '';
      }
    };

    triggers.forEach((trigger) => trigger.addEventListener('click', open));

    modalNode.querySelectorAll('[data-modal-close]').forEach((node) => {
      node.addEventListener('click', close);
    });

    modalRegistry.set(modalNode, close);
  };

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || openModals.size === 0) {
      return;
    }
    const modals = Array.from(openModals);
    const topModal = modals[modals.length - 1];
    const close = modalRegistry.get(topModal);
    if (typeof close === 'function') {
      close();
    }
  });

  setupModal(['#contactTrigger', '#ctaContact'], 'contactModal');
  setupModal(['#infoTrigger'], 'infoModal');

  const counters = document.querySelectorAll('[data-counter]');

  const animateCounter = (entry) => {
    const node = entry.target;
    const target = parseInt(node.dataset.counter, 10);
    const duration = 1600;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      node.textContent = value.toLocaleString(locale);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        node.textContent = target.toLocaleString(locale);
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((node) => {
    node.textContent = '0';
    counterObserver.observe(node);
  });

  const wordCloudContainer = document.getElementById('wordCloud');

  if (wordCloudContainer) {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const palette = ['#00BFB3', '#F04E98', '#FABD2F', '#0077C5', '#343741', '#A184FF'];
    const skills = [
      { label: 'Ansible / AAP', weight: 1.2 },
      { label: 'AI', weight: 1 },
      { label: 'Bitbucket', weight: 0.9 },
      { label: 'Jenkins', weight: 0.85 },
      { label: 'Bitbucket Pipelines', weight: 0.95 },
      { label: 'Docker', weight: 1.05 },
      { label: 'Podman', weight: 0.8 },
      { label: 'Elastic Cloud Enterprise', weight: 1.15 },
      { label: 'Elasticsearch 6.x → 9.x', weight: 1.25 },
      { label: 'Logstash', weight: 0.95 },
      { label: 'Ingest pipelines', weight: 0.9 },
      { label: 'Kibana dashboards', weight: 1.05 },
      { label: 'Canvas & Lens', weight: 0.85 },
      { label: 'Watcher & Alerting', weight: 0.9 },
      { label: 'ILM policies', weight: 0.85 },
      { label: 'Data streams', weight: 0.8 },
      { label: 'Searchable snapshots', weight: 0.75 },
      { label: 'CCR', weight: 0.7 },
      { label: 'Security realms', weight: 0.9 },
      { label: 'SSO / SAML', weight: 0.75 },
      { label: 'Fleet / Beats', weight: 0.85 },
      { label: 'Kafka connectors', weight: 0.8 },
      { label: 'Machine learning jobs', weight: 0.95 },
      { label: 'Elastic SIEM', weight: 0.9 },
      { label: 'Observability', weight: 0.9 },
      { label: 'Documentation', weight: 0.7 },
      { label: 'Playbook', weight: 0.7 },
      { label: 'Jenkins', weight: 0.7 },
      { label: 'Ansible', weight: 0.7 },
      { label: 'es/kib API', weight: 0.7 },
      { label: 'ECE 2.12 → 3.8', weight: 0.7 },
      { label: 'Production', weight: 0.7 },
      { label: 'Agile', weight: 0.7 },
      { label: 'llm', weight: 0.7 }
    ];

    if (reduceMotion) {
      wordCloudContainer.classList.add('word-cloud--static');
    }

    const nodes = skills.map((skill, index) => {
      const span = document.createElement('span');
      span.className = 'word-cloud__word';
      span.textContent = skill.label;
      const size = 1.15 + skill.weight * 0.55;
      span.style.fontSize = `${size}rem`;
      span.style.color = palette[index % palette.length];
      wordCloudContainer.appendChild(span);

      if (reduceMotion) {
        span.classList.add('word-cloud__word--static');
      }

      return {
        node: span,
        baseAngle: (index / skills.length) * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.6,
        orbit: 0.3 + (index / Math.max(skills.length - 1, 1)) * 0.55,
        direction: index % 2 === 0 ? 1 : -1,
        swirlOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.4 + Math.random() * 0.6,
        driftSpeed: 0.9 + Math.random() * 0.6
      };
    });

    if (reduceMotion) {
      return;
    }

    const animate = (time) => {
      const t = time * 0.001;
      const rect = wordCloudContainer.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const maxRadiusX = Math.max(centerX - 80, 120);
      const maxRadiusY = Math.max(centerY - 80, 120);

      nodes.forEach((item) => {
        const angularDrift = t * item.direction * (0.35 + item.speed * 0.18);
        const wobble = Math.sin(t * item.wobbleSpeed + item.swirlOffset) * 0.22;
        const extraOrbit = 0.75 + 0.25 * Math.sin(t * 0.5 + item.swirlOffset + Math.PI / 4);
        const radiusX = maxRadiusX * item.orbit * extraOrbit;
        const radiusY = maxRadiusY * item.orbit * (0.7 + 0.3 * Math.cos(t * 0.6 + item.swirlOffset));
        const angle = item.baseAngle + angularDrift;
        const offsetX = Math.cos(angle) * radiusX;
        const offsetY = Math.sin(angle * 1.15) * radiusY + wobble * 60;
        const depth = 0.35 + 0.65 * (1 + Math.sin(angle + item.swirlOffset)) / 2;
        const scale = 0.85 + depth * 0.4;
        const tilt = Math.sin(t * item.driftSpeed + item.swirlOffset) * 6;

        item.node.style.transform =
          `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${tilt}deg)`;
        item.node.style.opacity = (0.35 + depth * 0.65).toFixed(2);
        item.node.style.zIndex = Math.round(depth * 100);

        if (depth > 0.78) {
          item.node.classList.add('is-highlighted');
        } else {
          item.node.classList.remove('is-highlighted');
        }
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
})();
