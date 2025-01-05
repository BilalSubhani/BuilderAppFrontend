import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.less'],
  imports: [CommonModule, FormsModule ]
})
export class ImageComponent {
  selectedFile: File | null = null;
  uploadStatus: string = '';
  publicId: string = '';
  isHovering: boolean = false;

  constructor(private http: HttpClient) {}

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
      this.uploadStatus = 'Please select a file to upload';
      return;
    }

    if (!this.publicId) {
      this.uploadStatus = 'Please enter a public ID';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('public_id', this.publicId);

    this.http.post('http://localhost:3000/media/upload/image', formData).subscribe(
      (response: any) => {
        this.uploadStatus = `Image uploaded successfully: ${response.secure_url}`;
      },
      (error) => {
        console.error('Error uploading image:', error);
        this.uploadStatus = 'Failed to upload image';
      }
    );
  }
}
