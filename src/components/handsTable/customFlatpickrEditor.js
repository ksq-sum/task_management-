import Handsontable from "handsontable";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

class CustomDateTimeEditor extends Handsontable.editors.BaseEditor {
  constructor(hotInstance) {
    super(hotInstance);
    this.flatpickrInstance = null;
    this.inputElement = null;
  }

  init() {
    console.log("CustomDateTimeEditor.init() called");
    this.inputElement = document.createElement("input");
    this.inputElement.type = "text";
    this.inputElement.className = "htCustomEditorInput";
    this.inputElement.style.position = "absolute";
    this.inputElement.style.zIndex = 100;
    this.inputElement.style.display = "none";
    this.hot.rootElement.appendChild(this.inputElement);
  }

  prepare(row, col, prop, TD, originalValue, cellProperties) {
    console.log("CustomDateTimeEditor.prepare() called");
    super.prepare(row, col, prop, TD, originalValue, cellProperties);
    // 确保 prepare 中可以正确设置值
    this.originalValue = originalValue;
  }

  open() {
    console.log("CustomDateTimeEditor.open() called");
    if (!this.inputElement) {
      console.error("Input element is not initialized.");
      return;
    }

    const cellRect = this.TD.getBoundingClientRect();
    this.inputElement.style.top = `${cellRect.top + window.scrollY}px`;
    this.inputElement.style.left = `${cellRect.left + window.scrollX}px`;
    this.inputElement.style.height = `${cellRect.height}px`;
    this.inputElement.style.width = `${cellRect.width}px`;
    this.inputElement.style.display = ""; // 显示输入框

    this.flatpickrInstance = flatpickr(this.inputElement, {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      time_24hr: true,
      defaultDate: this.originalValue || null,
      onClose: () => {
        this.finishEditing();
      }
    });

    this.flatpickrInstance.open();
  }

  setValue(value) {
    console.log("CustomDateTimeEditor.setValue() called");
    if (!this.inputElement) {
      console.error("Input element is not initialized.");
      return;
    }
    this.inputElement.value = value || "";
  }

  getValue() {
    console.log("CustomDateTimeEditor.getValue() called");
    if (!this.inputElement) {
      console.error("Input element is not initialized.");
      return "";
    }
    return this.inputElement.value;
  }

  close() {
    console.log("CustomDateTimeEditor.close() called");
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
      this.flatpickrInstance = null;
    }
    if (this.inputElement) {
      this.inputElement.style.display = "none";
    }
  }

  destroy() {
    console.log("CustomDateTimeEditor.destroy() called");
    if (this.inputElement) {
      this.inputElement.parentNode.removeChild(this.inputElement);
      this.inputElement = null;
    }
  }
}

// 注册自定义编辑器
Handsontable.editors.registerEditor("customDateTimeEditor", CustomDateTimeEditor);

export default CustomDateTimeEditor;
