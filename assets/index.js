function ready() {
  let currentTool = '';
  let listFigures = [];
  let colors = {};
  let dragSource = null;

  if (localStorage.getItem('colorsState')) {
    const colorsStateObject = JSON.parse(localStorage.getItem('colorsState'));

    document.getElementById('current-color').style.backgroundColor = colorsStateObject.currentColor;
    document.getElementById('prev-color').style.backgroundColor = colorsStateObject.prevColor;
  }

  if (localStorage.getItem('canvasState')) {
    const conditionObject = JSON.parse(localStorage.getItem('canvasState'));

    document.querySelectorAll('.canvas__figure').forEach((item, index) => {
      const figure = item;
      figure.style.backgroundColor = conditionObject[index].color;
      if (conditionObject[index].classes[1]) {
        item.classList.add('-rounded');
      } else {
        item.classList.remove('-rounded');
      }
    });
  }

  function setCanvasState() {
    listFigures = [];

    document.querySelectorAll('.canvas__figure').forEach((item) => {
      listFigures.push({
        color: item.style.backgroundColor,
        classes: item.classList,
        draggable: item.getAttribute('data-draggable'),
      });
    });

    localStorage.setItem('canvasState', JSON.stringify(listFigures));
  }

  function setColorsState() {
    colors = {};

    colors.currentColor = document.getElementById('current-color').style.backgroundColor;
    colors.prevColor = document.getElementById('prev-color').style.backgroundColor;

    localStorage.setItem('colorsState', JSON.stringify(colors));
  }

  function paintFigure(element, color) {
    const figure = element;
    figure.style.background = color;
  }

  function transformFigure(figure) {
    figure.classList.toggle('-rounded');
  }

  function getColorElement(element) {
    const currentColor = getComputedStyle(document.getElementById('current-color')).backgroundColor;
    const newColor = getComputedStyle(element).backgroundColor;

    if (element.classList.contains('color-panel__color') || element.classList.contains('canvas__figure')) {
      document.getElementById('prev-color').style.background = currentColor;
      document.getElementById('current-color').style.background = newColor;
    }
  }

  function handleDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    dragSource = this;
    this.classList.add('moving');
  }

  function handleDragEnter() {
    this.classList.add('over');
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    return false;
  }

  function handleDragLeave() {
    this.classList.remove('over');
  }

  function swapFigures(obj1, obj2) {
    const parent = obj2.parentNode;
    const next = obj2.nextSibling;
    if (next === obj1) {
      parent.insertBefore(obj1, obj2);
    } else {
      obj1.parentNode.insertBefore(obj2, obj1);
      if (next) {
        parent.insertBefore(obj1, next);
      } else {
        parent.appendChild(obj1);
      }
    }
  }

  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    if (dragSource !== this) {
      swapFigures(dragSource, this);
    }
    return false;
  }

  function handleDragEnd() {
    document.querySelectorAll('.canvas__figure').forEach((item) => {
      item.classList.remove('over');
      item.classList.remove('moving');
    });

    setCanvasState();
  }

  function setAttributeDraggable() {
    document.querySelectorAll('.canvas__figure').forEach(item => item.setAttribute('draggable', true));
    document.querySelectorAll('.canvas__figure[draggable]').forEach((item) => {
      item.addEventListener('dragstart', handleDragStart, false);
      item.addEventListener('dragenter', handleDragEnter, false);
      item.addEventListener('dragover', handleDragOver, false);
      item.addEventListener('dragleave', handleDragLeave, false);
      item.addEventListener('drop', handleDrop, false);
      item.addEventListener('dragend', handleDragEnd, false);
    });
  }

  function removeAttributeDraggable() {
    document.querySelectorAll('.canvas__figure').forEach(item => item.removeAttribute('draggable'));
  }

  document.addEventListener('click', (e) => {
    switch (currentTool) {
      case 'paintBucket':
        if (e.target.classList.contains('canvas__figure')) {
          paintFigure(e.target, getComputedStyle(document.getElementById('current-color')).backgroundColor);
          setCanvasState();
        }
        break;
      case 'colorPicker':
        getColorElement(e.target);
        setColorsState();
        break;
      case 'move':
        break;
      case 'transform':
        if (e.target.classList.contains('canvas__figure')) {
          transformFigure(e.target);
          setCanvasState();
        }
        break;
      default:
        return true;
    }
    return true;
  });

  document
    .querySelector('.tools-panel__list')
    .addEventListener('click', (e) => {
      Array.from(e.currentTarget.children).forEach((item) => {
        if (item !== e.target) {
          item.classList.remove('-selected');
        } else {
          item.classList.add('-selected');
        }
      });
      currentTool = e.target.getAttribute('data-tool');
      document.body.setAttribute('data-tool', e.target.getAttribute('data-tool'));
      if (currentTool === 'move') {
        setAttributeDraggable();
      } else {
        removeAttributeDraggable();
      }
    });

  document.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
      case 80:
        document.querySelector('.tools-panel__item[data-tool=paintBucket]').click();
        break;
      case 67:
        document.querySelector('.tools-panel__item[data-tool=colorPicker]').click();
        break;
      case 77:
        document.querySelector('.tools-panel__item[data-tool=move]').click();
        break;
      case 84:
        document.querySelector('.tools-panel__item[data-tool=transform]').click();
        break;
      default:
        return true;
    }
    return true;
  });

  document.getElementById('clear-button').addEventListener('click', () => {
    localStorage.clear();
    document.location.reload(true);
  });
}

document.addEventListener('DOMContentLoaded', ready);
