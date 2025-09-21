// базовая цена
const basePrice = 20000;
const priceEl = document.getElementById('price');
const exportBtn = document.getElementById('exportBtn');
const antresolInput = document.getElementById('antresol');
const antresolWrapper = document.getElementById('antresol-wrapper');

const config = {};

// пересчет цены
function updatePrice() {
  let p = basePrice;
  Object.values(config).forEach(it => { if (it && it.price) p += Number(it.price); });
  if (antresolInput && antresolInput.checked) p += Number(antresolInput.dataset.price || 0);
  priceEl.textContent = p;
}

// helper: close all opens
function closeAllExcept(except = null) {
  document.querySelectorAll('.custom-select.open').forEach(s => { if (s !== except) s.classList.remove('open'); });
}

// init custom selects
document.querySelectorAll('.custom-select').forEach(select => {
  const selected = select.querySelector('.selected');
  const options = select.querySelector('.custom-options');

  // open/close quickly
  selected.addEventListener('pointerdown', e => {
    e.stopPropagation();
    closeAllExcept(select);
    select.classList.toggle('open');
    // force reflow to stabilize hitboxes
    void selected.offsetWidth;
  });

  // option click
  options.querySelectorAll('div[data-value]').forEach(opt => {
    opt.addEventListener('pointerdown', e => {
      e.stopPropagation();

      // set text & state
      selected.textContent = opt.textContent;
      select.classList.add('selected');

      // save
      config[select.dataset.name] = { value: opt.dataset.value || opt.textContent, price: opt.dataset.price || 0 };
      updatePrice();

      // blur & force repaint (fix chrome hitbox issue)
      try { selected.blur(); } catch (err) {}
      selected.classList.add('repaint-hack');
      void selected.offsetWidth;
      selected.classList.remove('repaint-hack');

      // close
      select.classList.remove('open');
    });
  });
});

// close on outside click
document.addEventListener('pointerdown', () => closeAllExcept(null));

// antresol behavior
if (antresolWrapper && antresolInput) {
  antresolWrapper.addEventListener('pointerdown', e => {
    if (e.target !== antresolInput) antresolInput.checked = !antresolInput.checked;
    antresolWrapper.classList.toggle('selected', antresolInput.checked);
    updatePrice();
  });
  antresolInput.addEventListener('change', () => {
    antresolWrapper.classList.toggle('selected', antresolInput.checked);
    updatePrice();
  });
}

// export button demo
if (exportBtn) exportBtn.addEventListener('click', () => alert('Добавлено в корзину!'));

// initial price
updatePrice();
