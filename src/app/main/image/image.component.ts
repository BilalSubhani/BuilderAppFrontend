import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.less'],
  imports: [CommonModule, FormsModule ]
})
export class ImageComponent {
  selectedFile: File | null = null;
  publicId: string = '';
  isHovering: boolean = false;

  imageChanged: boolean = false;
  @Output() imageSent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() pID!: string;

  constructor(
    private http: HttpClient,     
    private toastr: ToastrService
  ) {}

  ngOnChanges(){
    this.publicId=this.pID;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  onDrop(event: any) {
    event.preventDefault();
    this.isHovering = false;
    this.selectedFile = event.dataTransfer.files[0] || null;
  }

  onDragOver(event: any) {
    event.preventDefault();
    this.isHovering = true;
  }

  onDragLeave(event: any) {
    this.isHovering = false;
  }

  onUpload() {
    if (!this.selectedFile) {
      this.toastr.warning('Please Select a File', 'Error uploading image', {
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'decreasing'
      });
      return;
    }

    if (!this.publicId) {
      this.toastr.warning('Please enter a public ID', 'Error uploading image', {
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'decreasing'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('public_id', this.publicId);

    this.http.post('http://localhost:3000/media/upload/image', formData).subscribe(
      (response: any) => {
        this.toastr.success('', 'Image uploaded successfully', {
          positionClass: 'toast-top-right',
          progressBar: true,
          progressAnimation: 'increasing'
        });

        this.changed();
      },
      (error) => {
        this.toastr.error(error, 'Error uploading image', {
          positionClass: 'toast-top-right',
          progressBar: true,
          progressAnimation: 'decreasing'
        });
      }
    );
  }
  changed(){
    this.imageChanged = true;

    if (this.imageChanged) {
      this.imageSent.emit(this.imageChanged);
      this.publicId = '';
      this.imageChanged = false;
    }
  }
}
