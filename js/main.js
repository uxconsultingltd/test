class detailSelect {
    constructor(container) {
      this.container = document.querySelector(container);
      this.options = document.querySelectorAll(`${container} > .select > .select__option`);
      this.value = this.container.querySelector('summary').textContent;
      this.mouseDown = false;
      this._addEventListeners();
      this._setAria();
      this.updateValue();
    }
  
    // Private function to set event listeners
    _addEventListeners() {
      this.container.addEventListener('toggle', () => {
        if (this.container.open) return;
        this.updateValue();
      })
  
      this.container.addEventListener('focusout', e => {
        if (this.mouseDown) return;
        this.container.removeAttribute('open');
      })
  
      this.options.forEach(opt => {
        opt.addEventListener('mousedown', () => {
          this.mouseDown = true;
        })
        opt.addEventListener('mouseup', () => {
          this.mouseDown = false;
          this.container.removeAttribute('open');
        })
      })
  
      this.container.addEventListener('keyup', e => {
        const keycode = e.which;
        const current = [...this.options].indexOf(this.container.querySelector('.active'));
        switch (keycode) {
          case 27: // ESC
            this.container.removeAttribute('open');
            break;
          case 35: // END
            e.preventDefault();
            if (!this.container.open) this.container.setAttribute('open', '');
            this.setChecked(this.options[this.options.length - 1].querySelector('input'))
            break;
          case 36: // HOME
            e.preventDefault();
            if (!this.container.open) this.container.setAttribute('open', '');
            this.setChecked(this.options[0].querySelector('input'))
            break;
          case 38: // UP
            e.preventDefault();
            if (!this.container.open) this.container.setAttribute('open', '');
            this.setChecked(this.options[current > 0 ? current - 1 : 0].querySelector('input'));
            break;
          case 40: // DOWN
            e.preventDefault();
            if (!this.container.open) this.container.setAttribute('open', '');
            this.setChecked(this.options[current < this.options.length - 1 ? current + 1 : this.options.length - 1].querySelector('input'));
            break;
        }
      })
    }
  
    _setAria() {
      this.container.setAttribute('aria-haspopup', 'listbox');
      const selectBox = this.container.querySelector('.select');
      selectBox.setAttribute('role', 'listbox');
      selectBox.querySelector('[type=radio]').setAttribute('role', 'option')
    }
  
    updateValue(e) {
      const that = this.container.querySelector('input:checked');
      if (!that) return;
      this.setValue(that)
    }
  
    setChecked(that) {
      that.checked = true;
      this.setValue(that)
    }
  
    setValue(that) {
      if (this.value == that.value) return;
  
      this.container.querySelector('summary').textContent = that.parentNode.textContent;
      this.value = that.value;
  
      this.options.forEach(opt => {
        opt.classList.remove('active');
      })
      that.parentNode.classList.add('active');
  
      this.container.dispatchEvent(new Event('change'));
    }
  }
  
  const details = new detailSelect('#example_select');  




const SPACEBAR_KEY_CODE = [0, 32];
const ENTER_KEY_CODE = 13;
const DOWN_ARROW_KEY_CODE = 40;
const UP_ARROW_KEY_CODE = 38;
const ESCAPE_KEY_CODE = 27;

const list = document.querySelector(".dropdown__list");
const listContainer = document.querySelector(".dropdown__list-container");
const dropdownArrow = document.querySelector(".dropdown__arrow");
const listItems = document.querySelectorAll(".dropdown__list-item");
const dropdownSelectedNode = document.querySelector(
  "#dropdown__selected"
);
const listItemIds = [];

dropdownSelectedNode.addEventListener("click", e =>
                                      toggleListVisibility(e)
                                     );
dropdownSelectedNode.addEventListener("keydown", e =>
                                      toggleListVisibility(e)
                                     );

listItems.forEach(item => listItemIds.push(item.id));

listItems.forEach(item => {
  item.addEventListener("click", e => {
    setSelectedListItem(e);
    closeList();
  });

  item.addEventListener("keydown", e => {
    switch (e.keyCode) {
      case ENTER_KEY_CODE:
        setSelectedListItem(e);
        closeList();
        return;

      case DOWN_ARROW_KEY_CODE:
        focusNextListItem(DOWN_ARROW_KEY_CODE);
        return;

      case UP_ARROW_KEY_CODE:
        focusNextListItem(UP_ARROW_KEY_CODE);
        return;

      case ESCAPE_KEY_CODE:
        closeList();
        return;

      default:
        return;
    }
  });
});

function setSelectedListItem(e) {
  let selectedTextToAppend = document.createTextNode(e.target.innerText);
  dropdownSelectedNode.innerHTML = null;
  dropdownSelectedNode.appendChild(selectedTextToAppend);
}

function closeList() {
  list.classList.remove("open");
  dropdownArrow.classList.remove("expanded");
  listContainer.setAttribute("aria-expanded", false);
}

function toggleListVisibility(e) {
  let openDropDown =
      SPACEBAR_KEY_CODE.includes(e.keyCode) || e.keyCode === ENTER_KEY_CODE;

  if (e.keyCode === ESCAPE_KEY_CODE) {
    closeList();
  }

  if (e.type === "click" || openDropDown) {
    list.classList.toggle("open");
    dropdownArrow.classList.toggle("expanded");
    listContainer.setAttribute(
      "aria-expanded",
      list.classList.contains("open")
    );
  }

  if (e.keyCode === DOWN_ARROW_KEY_CODE) {
    focusNextListItem(DOWN_ARROW_KEY_CODE);
  }

  if (e.keyCode === UP_ARROW_KEY_CODE) {
    focusNextListItem(UP_ARROW_KEY_CODE);
  }
}

function focusNextListItem(direction) {
  const activeElementId = document.activeElement.id;
  if (activeElementId === "dropdown__selected") {
    document.querySelector(`#${listItemIds[0]}`).focus();
  } else {
    const currentActiveElementIndex = listItemIds.indexOf(
      activeElementId
    );
    if (direction === DOWN_ARROW_KEY_CODE) {
      const currentActiveElementIsNotLastItem =
            currentActiveElementIndex < listItemIds.length - 1;
      if (currentActiveElementIsNotLastItem) {
        const nextListItemId = listItemIds[currentActiveElementIndex + 1];
        document.querySelector(`#${nextListItemId}`).focus();
      }
    } else if (direction === UP_ARROW_KEY_CODE) {
      const currentActiveElementIsNotFirstItem =
            currentActiveElementIndex > 0;
      if (currentActiveElementIsNotFirstItem) {
        const nextListItemId = listItemIds[currentActiveElementIndex - 1];
        document.querySelector(`#${nextListItemId}`).focus();
      }
    }
  }
}