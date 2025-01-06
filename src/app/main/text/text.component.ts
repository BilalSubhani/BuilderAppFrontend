import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-text',
  standalone: true,
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.less'],
  imports: [FormsModule]
})
export class TextComponent {

  constructor(
    private toastr: ToastrService
  ){}
  textInput: string = '';
  @Output() textSent: EventEmitter<string> = new EventEmitter<string>();

  sendText() {
    if(this.textInput === '') {
      this.toastr.warning('Text field cannot be empty', 'Error!', {
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'decreasing'
      });
      return;
    }

    if (this.textInput.trim()) {
      this.textSent.emit(this.textInput);
      this.textInput = '';
    }
  }
}