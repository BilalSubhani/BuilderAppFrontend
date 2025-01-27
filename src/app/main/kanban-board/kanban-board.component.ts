import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.less'],
  imports: [CommonModule, FormsModule],
})
export class KanbanBoardComponent {
  @Input() listItems: { key: string; values: string[] }[] = [];
  @Output() listItemsChange = new EventEmitter<
    { key: string; values: string[] }[]
  >();

  newKey = '';
  newValue = '';
  editingKey = { key: '', index: -1 };
  editingValue = { value: '', keyIndex: -1, valueIndex: -1 };

  emitUpdates() {
    this.listItemsChange.emit([...this.listItems]);
  }

  addKey() {
    if (this.newKey.trim()) {
      this.listItems = [
        ...this.listItems,
        { key: this.newKey.trim(), values: [] },
      ];
      this.newKey = '';
      this.emitUpdates();
    }
  }

  deleteKey(key: string) {
    this.listItems = this.listItems.filter((item) => item.key !== key);
    this.emitUpdates();
  }

  addValue(key: string) {
    const updatedList = this.listItems.map((item) => {
      if (item.key === key && this.newValue.trim()) {
        return { ...item, values: [...item.values, this.newValue.trim()] };
      }
      return item;
    });

    this.listItems = updatedList;
    this.newValue = '';
    this.emitUpdates();
  }

  deleteValue(key: string, value: string) {
    const updatedList = this.listItems.map((item) => {
      if (item.key === key) {
        return { ...item, values: item.values.filter((val) => val !== value) };
      }
      return item;
    });

    this.listItems = updatedList;
    this.emitUpdates();
  }

  startEditKey(key: string, index: number) {
    this.editingKey = { key, index };
  }

  saveEditKey() {
    if (this.editingKey.index !== -1 && this.editingKey.key.trim()) {
      const updatedList = [...this.listItems];
      updatedList[this.editingKey.index].key = this.editingKey.key.trim();
      this.listItems = updatedList;
      this.editingKey = { key: '', index: -1 };
      this.emitUpdates();
    }
  }

  cancelEditKey() {
    this.editingKey = { key: '', index: -1 };
  }

  startEditValue(value: string, keyIndex: number, valueIndex: number) {
    this.editingValue = { value, keyIndex, valueIndex };
  }

  saveEditValue() {
    if (
      this.editingValue.keyIndex !== -1 &&
      this.editingValue.valueIndex !== -1 &&
      this.editingValue.value.trim()
    ) {
      const updatedList = [...this.listItems];
      updatedList[this.editingValue.keyIndex].values[
        this.editingValue.valueIndex
      ] = this.editingValue.value.trim();
      this.listItems = updatedList;
      this.editingValue = { value: '', keyIndex: -1, valueIndex: -1 };
      this.emitUpdates();
    }
  }

  cancelEditValue() {
    this.editingValue = { value: '', keyIndex: -1, valueIndex: -1 };
  }

  onDragStart(event: DragEvent, key: string, value: string) {
    event.dataTransfer?.setData('text/plain', JSON.stringify({ key, value }));
  }

  onDrop(event: DragEvent, targetKey: string) {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    if (data) {
      const { key, value } = JSON.parse(data);
      this.moveValue(key, value, targetKey);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  moveValue(sourceKey: string, value: string, targetKey: string) {
    const updatedList = this.listItems.map((item) => {
      if (item.key === sourceKey) {
        if (sourceKey === targetKey) {
          const values = [...item.values];
          const valueIndex = values.indexOf(value);
          values.splice(valueIndex, 1);
          values.splice(valueIndex + 1, 0, value);
          return { ...item, values };
        } else {
          return {
            ...item,
            values: item.values.filter((val) => val !== value),
          };
        }
      } else if (item.key === targetKey) {
        return { ...item, values: [...item.values, value] };
      }
      return item;
    });

    this.listItems = updatedList;
    this.emitUpdates();
  }
}
