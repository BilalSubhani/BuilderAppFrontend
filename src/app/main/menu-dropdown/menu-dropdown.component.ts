import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-dropdown',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-dropdown.component.html',
  styleUrl: './menu-dropdown.component.less',
})
export class MenuDropdownComponent {
  constructor(private renderer: Renderer2) {}
  @Input() listItems: any;
  @Output() listItemsEvent = new EventEmitter<any>();

  editingKeyIndex: number | null = null;
  editingValueIndex: { [key: number]: number | null } = {};

  expandedIndex: number = -1;
  indexUp: number = -1;

  newKey: string = '';
  newValues: { [key: string]: string } = {};

  draggedItemIndex: number | null = null;
  draggedValueIndex: { [key: number]: number | null } = {};

  toggleExpand(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }

  addValue(item: { key: string; values: string[] }): void {
    const newValue = this.newValues[item.key]?.trim();
    if (item.key) {
      this.listItems[this.expandedIndex].values.push(newValue);
      this.newValues[item.key] = '';
    }
    this.navListEvent();
  }

  removeValue(item: { key: string; values: string[] }, index: number): void {
    this.listItems[this.expandedIndex].values.splice(index, 1);
    this.navListEvent();
  }

  addNewKey(): void {
    const trimmedKey = this.newKey.trim();
    if (trimmedKey) {
      this.listItems.push({ key: trimmedKey, values: [] });
      this.newKey = '';
    }
    this.navListEvent();
  }

  removeKey(index: number): void {
    this.listItems.splice(index, 1);
    if (this.expandedIndex === index) {
      this.expandedIndex = -1;
    } else if (this.expandedIndex > index) {
      this.expandedIndex--;
    }
    this.navListEvent();
  }

  editKey(index: number): void {
    event?.stopPropagation();
    this.editingKeyIndex = index;
  }

  saveKey(index: number): void {
    event?.stopPropagation();
    this.editingKeyIndex = null;
    this.navListEvent();
  }

  cancelEditKey(index: number): void {
    event?.stopPropagation();
    this.editingKeyIndex = null;
  }

  editValue(itemIndex: number, valueIndex: number): void {
    event?.stopPropagation();
    itemIndex--;
    this.editingValueIndex[itemIndex] = valueIndex;
  }

  saveValue(itemIndex: number, valueIndex: number): void {
    event?.stopPropagation();
    itemIndex--;
    this.editingValueIndex[itemIndex] = null;
    this.navListEvent();
  }

  cancelEditValue(itemIndex: number, valueIndex: number): void {
    event?.stopPropagation();
    itemIndex--;
    this.editingValueIndex[itemIndex] = null;
  }

  onDragStart(itemIndex: number): void {
    this.draggedItemIndex = itemIndex;
  }

  onValueDragStart(
    itemIndex: number,
    valueIndex: number,
    event: DragEvent
  ): void {
    itemIndex--;
    event.stopPropagation();
    this.draggedItemIndex = itemIndex;
    this.draggedValueIndex[itemIndex] = valueIndex;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(itemIndex: number): void {
    if (this.draggedItemIndex !== null && this.draggedItemIndex !== itemIndex) {
      const draggedItem = this.listItems[this.draggedItemIndex];
      this.listItems.splice(this.draggedItemIndex, 1);
      this.listItems.splice(itemIndex, 0, draggedItem);

      if (this.expandedIndex === this.draggedItemIndex) {
        this.expandedIndex = itemIndex;
      } else if (
        this.expandedIndex > this.draggedItemIndex &&
        this.expandedIndex <= itemIndex
      ) {
        this.expandedIndex--;
      } else if (
        this.expandedIndex < this.draggedItemIndex &&
        this.expandedIndex >= itemIndex
      ) {
        this.expandedIndex++;
      }

      this.draggedItemIndex = null;

      this.navListEvent();
    }
  }

  onValueDrop(itemIndex: number, valueIndex: number, event: DragEvent): void {
    event.stopPropagation();
    if (
      this.draggedItemIndex !== null &&
      this.draggedValueIndex[this.expandedIndex] !== null &&
      this.draggedItemIndex === this.expandedIndex
    ) {
      const values = this.listItems[this.expandedIndex].values;
      const draggedValue = values[this.draggedValueIndex[this.expandedIndex]!];
      values.splice(this.draggedValueIndex[this.expandedIndex]!, 1);
      values.splice(valueIndex, 0, draggedValue);
      this.draggedItemIndex = null;
      this.draggedValueIndex[this.expandedIndex] = null;
    }

    this.navListEvent();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  navListEvent() {
    this.listItemsEvent.emit(this.listItems);
  }
}
